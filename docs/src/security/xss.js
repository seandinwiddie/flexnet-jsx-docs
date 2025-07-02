// === XSS Prevention Implementation ===
// Pure functional XSS prevention utilities for FlexNet security

import Either from '../core/types/either.js';
import Maybe from '../core/types/maybe.js';
import Result from '../core/types/result.js';
import { compose, pipe, curry } from '../core/functions/composition.js';

// HTML entity mappings for escaping
const HTML_ENTITIES = Object.freeze({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
});

// Dangerous HTML tags that should be stripped
const DANGEROUS_TAGS = Object.freeze([
    'script', 'iframe', 'object', 'embed', 'form', 'input', 'textarea',
    'button', 'select', 'option', 'link', 'meta', 'style', 'title',
    'head', 'html', 'body', 'frameset', 'frame', 'noframes', 'applet',
    'bgsound', 'blink', 'marquee', 'xml', 'plaintext', 'xmp'
]);

// Dangerous attributes that should be removed
const DANGEROUS_ATTRIBUTES = Object.freeze([
    'onabort', 'onactivate', 'onafterprint', 'onafterupdate', 'onbeforeactivate',
    'onbeforecopy', 'onbeforecut', 'onbeforedeactivate', 'onbeforeeditfocus',
    'onbeforepaste', 'onbeforeprint', 'onbeforeunload', 'onbeforeupdate',
    'onblur', 'onbounce', 'oncellchange', 'onchange', 'onclick', 'oncontextmenu',
    'oncontrolselect', 'oncopy', 'oncut', 'ondataavailable', 'ondatasetchanged',
    'ondatasetcomplete', 'ondblclick', 'ondeactivate', 'ondrag', 'ondragend',
    'ondragenter', 'ondragleave', 'ondragover', 'ondragstart', 'ondrop',
    'onerror', 'onerrorupdate', 'onfilterchange', 'onfinish', 'onfocus',
    'onfocusin', 'onfocusout', 'onhelp', 'onkeydown', 'onkeypress', 'onkeyup',
    'onlayoutcomplete', 'onload', 'onlosecapture', 'onmousedown', 'onmouseenter',
    'onmouseleave', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup',
    'onmousewheel', 'onmove', 'onmoveend', 'onmovestart', 'onpaste',
    'onpropertychange', 'onreadystatechange', 'onreset', 'onresize',
    'onresizeend', 'onresizestart', 'onrowenter', 'onrowexit', 'onrowsdelete',
    'onrowsinserted', 'onscroll', 'onselect', 'onselectionchange',
    'onselectstart', 'onstart', 'onstop', 'onsubmit', 'onunload', 'javascript',
    'vbscript', 'data', 'src', 'href'
]);

// Protocol whitelist for URLs
const SAFE_PROTOCOLS = Object.freeze([
    'http:', 'https:', 'mailto:', 'tel:', 'ftp:', '#'
]);

// Core HTML escaping function
export const escapeHTML = (text) =>
    Maybe.fromNullable(text)
        .map(String)
        .map(str => str.replace(/[&<>"'`=\/]/g, char => HTML_ENTITIES[char] || char))
        .getOrElse('');

// Escape HTML attributes
export const escapeAttribute = (value) =>
    Maybe.fromNullable(value)
        .map(String)
        .map(str => str.replace(/[&<>"'`]/g, char => HTML_ENTITIES[char] || char))
        .getOrElse('');

// Validate and sanitize URLs
export const sanitizeURL = (url) => {
    if (!url || typeof url !== 'string') {
        return Either.Left('Invalid URL: not a string');
    }
    
    // Remove whitespace and control characters
    const cleanURL = url.trim().replace(/[\x00-\x1F\x7F]/g, '');
    
    // Check for javascript: and other dangerous protocols
    const dangerousProtocols = /^(javascript|data|vbscript|file|about):/i;
    if (dangerousProtocols.test(cleanURL)) {
        return Either.Left('Dangerous protocol detected');
    }
    
    // Allow relative URLs, fragments, and safe protocols
    if (cleanURL.startsWith('#') || cleanURL.startsWith('/') || cleanURL.startsWith('./')) {
        return Either.Right(cleanURL);
    }
    
    // Functional URL parsing without constructor
    const parseURLFunctionally = (urlString) => {
        const protocolMatch = urlString.match(/^([a-zA-Z][a-zA-Z\d+\-.]*:)/);
        if (!protocolMatch) {
            return Either.Left('Invalid URL format - no protocol');
        }
        
        const protocol = protocolMatch[1].toLowerCase();
        
        if (SAFE_PROTOCOLS.includes(protocol)) {
            return Either.Right({
                protocol,
                href: urlString,
                isValid: true
            });
        } else {
            return Either.Left(`Unsafe protocol: ${protocol}`);
        }
    };
    
    return parseURLFunctionally(cleanURL)
        .fold(
            error => Either.Left(error),
            parsed => Either.Right(parsed.href)
        );
};

// Check if tag is dangerous
export const isDangerousTag = (tagName) =>
    Maybe.fromNullable(tagName)
        .map(tag => tag.toLowerCase())
        .map(tag => DANGEROUS_TAGS.includes(tag))
        .getOrElse(false);

// Check if attribute is dangerous
export const isDangerousAttribute = (attrName) =>
    Maybe.fromNullable(attrName)
        .map(attr => attr.toLowerCase())
        .map(attr => 
            DANGEROUS_ATTRIBUTES.includes(attr) ||
            attr.startsWith('on') ||
            attr.includes('javascript:') ||
            attr.includes('vbscript:')
        )
        .getOrElse(false);

// Sanitize element props for safe rendering
export const sanitizeProps = (props) =>
    Result.fromTry(() => {
        if (!props || typeof props !== 'object') {
            return {};
        }
        
        const sanitized = {};
        
        Object.entries(props).forEach(([key, value]) => {
            // Skip dangerous attributes
            if (isDangerousAttribute(key)) {
                return;
            }
            
            // Handle special cases
            if (key === 'href' || key === 'src') {
                const urlResult = sanitizeURL(value);
                if (urlResult.type === 'Right') {
                    sanitized[key] = urlResult.value;
                }
                return;
            }
            
            // Handle style attribute
            if (key === 'style') {
                const styleResult = sanitizeStyle(value);
                if (styleResult.type === 'Right') {
                    sanitized[key] = styleResult.value;
                }
                return;
            }
            
            // Handle regular attributes
            if (typeof value === 'string') {
                sanitized[key] = escapeAttribute(value);
            } else if (typeof value === 'number' || typeof value === 'boolean') {
                sanitized[key] = value;
            }
        });
        
        return Object.freeze(sanitized);
    });

// Sanitize CSS styles
export const sanitizeStyle = (styles) => {
    if (!styles) {
        return Either.Right({});
    }
    
    if (typeof styles === 'string') {
        // Basic CSS injection prevention
        const dangerousPatterns = [
            /javascript:/i,
            /vbscript:/i,
            /expression\(/i,
            /url\(/i,
            /@import/i,
            /binding:/i
        ];
        
        for (const pattern of dangerousPatterns) {
            if (pattern.test(styles)) {
                return Either.Left('Dangerous CSS detected');
            }
        }
        
        return Either.Right(styles);
    }
    
    if (typeof styles === 'object') {
        const sanitized = {};
        
        Object.entries(styles).forEach(([property, value]) => {
            // Convert camelCase to kebab-case
            const cssProperty = property.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
            
            // Basic validation
            if (typeof value === 'string' || typeof value === 'number') {
                const stringValue = String(value);
                
                // Check for dangerous patterns
                const dangerousPatterns = [
                    /javascript:/i,
                    /vbscript:/i,
                    /expression\(/i,
                    /url\(/i,
                    /@import/i
                ];
                
                let isDangerous = false;
                for (const pattern of dangerousPatterns) {
                    if (pattern.test(stringValue)) {
                        isDangerous = true;
                        break;
                    }
                }
                
                if (!isDangerous) {
                    sanitized[cssProperty] = stringValue;
                }
            }
        });
        
        return Either.Right(Object.freeze(sanitized));
    }
    
    return Either.Left('Invalid style format');
};

// Safe innerHTML alternative
export const safeSetHTML = curry((htmlContent, element) =>
    Result.fromTry(() => {
        if (!element || !element.nodeType) {
            throw new Error('Invalid element');
        }
        
        // Create a temporary container for parsing
        const temp = document.createElement('div');
        temp.innerHTML = htmlContent;
        
        // Sanitize the parsed content
        const sanitized = sanitizeElement(temp);
        
        if (sanitized.type === 'Error') {
            throw new Error(sanitized.error);
        }
        
        // Clear the target element and append sanitized content
        element.innerHTML = '';
        Array.from(sanitized.value.childNodes).forEach(node => {
            element.appendChild(node.cloneNode(true));
        });
        
        return element;
    })
);

// Recursively sanitize DOM elements
const sanitizeElement = (element) =>
    Result.fromTry(() => {
        if (!element || element.nodeType !== 1) {
            return element;
        }
        
        const tagName = element.tagName.toLowerCase();
        
        // Remove dangerous tags entirely
        if (isDangerousTag(tagName)) {
            const textNode = document.createTextNode(element.textContent || '');
            element.parentNode?.replaceChild(textNode, element);
            return textNode;
        }
        
        // Sanitize attributes
        const attributes = Array.from(element.attributes);
        attributes.forEach(attr => {
            if (isDangerousAttribute(attr.name)) {
                element.removeAttribute(attr.name);
            } else if (attr.name === 'href' || attr.name === 'src') {
                const urlResult = sanitizeURL(attr.value);
                if (urlResult.type === 'Left') {
                    element.removeAttribute(attr.name);
                }
            }
        });
        
        // Recursively sanitize children
        Array.from(element.childNodes).forEach(child => {
            if (child.nodeType === 1) {
                sanitizeElement(child);
            }
        });
        
        return element;
    });

// Content Security Policy nonce injection
export const addNonceToElement = curry((nonce, element) =>
    Maybe.fromNullable(element)
        .chain(el => el.tagName ? Maybe.Just(el) : Maybe.Nothing())
        .map(el => {
            const tagName = el.tagName.toLowerCase();
            if (tagName === 'script' || tagName === 'style') {
                el.setAttribute('nonce', nonce);
            }
            return el;
        })
);

// Safe text content setting
export const safeSetText = curry((textContent, element) =>
    Result.fromTry(() => {
        if (!element || !element.nodeType) {
            throw new Error('Invalid element');
        }
        
        // Use textContent to prevent HTML injection
        element.textContent = String(textContent || '');
        return element;
    })
);

// Validate and sanitize form data
export const sanitizeFormData = (formData) =>
    Result.fromTry(() => {
        if (!formData || typeof formData !== 'object') {
            return {};
        }
        
        const sanitized = {};
        
        Object.entries(formData).forEach(([key, value]) => {
            // Sanitize field names
            const safeKey = key.replace(/[^a-zA-Z0-9_-]/g, '');
            
            if (safeKey && value !== undefined) {
                if (typeof value === 'string') {
                    // Basic XSS prevention for form inputs
                    sanitized[safeKey] = escapeHTML(value);
                } else if (typeof value === 'number' || typeof value === 'boolean') {
                    sanitized[safeKey] = value;
                } else if (Array.isArray(value)) {
                    sanitized[safeKey] = value
                        .filter(item => typeof item === 'string' || typeof item === 'number')
                        .map(item => typeof item === 'string' ? escapeHTML(item) : item);
                }
            }
        });
        
        return Object.freeze(sanitized);
    });

// Create a safe element factory
export const createSafeElement = (tagName, props = {}, ...children) => {
    // Validate tag name
    if (isDangerousTag(tagName)) {
        return Either.Left(`Dangerous tag: ${tagName}`);
    }
    
    // Sanitize props
    const propsResult = sanitizeProps(props);
    if (propsResult.type === 'Error') {
        return Either.Left(propsResult.error);
    }
    
    // Sanitize children (text content)
    const safeChildren = children
        .flat(Infinity)
        .filter(child => child !== null && child !== undefined)
        .map(child => typeof child === 'string' ? escapeHTML(child) : child);
    
    return Either.Right({
        type: tagName,
        props: Object.freeze({
            ...propsResult.value,
            children: Object.freeze(safeChildren)
        }),
        _isSafeElement: true
    });
};

// Validate that content is safe for rendering
export const validateSafeContent = (content) => {
    if (typeof content === 'string') {
        // Check for potential XSS patterns
        const xssPatterns = [
            /<script[^>]*>.*?<\/script>/gi,
            /javascript:/gi,
            /vbscript:/gi,
            /onload\s*=/gi,
            /onclick\s*=/gi,
            /onerror\s*=/gi,
            /<iframe[^>]*>/gi,
            /<object[^>]*>/gi,
            /<embed[^>]*>/gi,
            /<form[^>]*>/gi
        ];
        
        for (const pattern of xssPatterns) {
            if (pattern.test(content)) {
                return Either.Left('Potentially dangerous content detected');
            }
        }
        
        return Either.Right(content);
    }
    
    if (content && typeof content === 'object' && content._isSafeElement) {
        return Either.Right(content);
    }
    
    return Either.Left('Invalid content type');
};

// Export common XSS prevention utilities
export const XSS_UTILS = Object.freeze({
    escapeHTML,
    escapeAttribute,
    sanitizeURL,
    sanitizeProps,
    sanitizeStyle,
    sanitizeFormData,
    safeSetHTML,
    safeSetText,
    createSafeElement,
    validateSafeContent
});
