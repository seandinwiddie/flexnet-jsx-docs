// === Content Security Policy (CSP) Implementation ===
// Pure functional CSP utilities for FlexNet security

import Either from '../core/types/either.js';
import Maybe from '../core/types/maybe.js';
import Result from '../core/types/result.js';
import { compose, pipe } from '../core/functions/composition.js';

// CSP directive types and validation
const CSP_DIRECTIVES = Object.freeze({
    DEFAULT_SRC: 'default-src',
    SCRIPT_SRC: 'script-src',
    STYLE_SRC: 'style-src',
    IMG_SRC: 'img-src',
    CONNECT_SRC: 'connect-src',
    FONT_SRC: 'font-src',
    OBJECT_SRC: 'object-src',
    MEDIA_SRC: 'media-src',
    FRAME_SRC: 'frame-src',
    CHILD_SRC: 'child-src',
    FORM_ACTION: 'form-action',
    BASE_URI: 'base-uri',
    FRAME_ANCESTORS: 'frame-ancestors'
});

// CSP source keywords
const CSP_SOURCES = Object.freeze({
    SELF: "'self'",
    UNSAFE_INLINE: "'unsafe-inline'",
    UNSAFE_EVAL: "'unsafe-eval'",
    STRICT_DYNAMIC: "'strict-dynamic'",
    NONE: "'none'",
    DATA: 'data:',
    BLOB: 'blob:',
    HTTPS: 'https:'
});

// Default secure CSP policy
const DEFAULT_CSP_POLICY = Object.freeze({
    [CSP_DIRECTIVES.DEFAULT_SRC]: [CSP_SOURCES.SELF],
    [CSP_DIRECTIVES.SCRIPT_SRC]: [CSP_SOURCES.SELF],
    [CSP_DIRECTIVES.STYLE_SRC]: [CSP_SOURCES.SELF, CSP_SOURCES.UNSAFE_INLINE],
    [CSP_DIRECTIVES.IMG_SRC]: [CSP_SOURCES.SELF, CSP_SOURCES.DATA, CSP_SOURCES.HTTPS],
    [CSP_DIRECTIVES.CONNECT_SRC]: [CSP_SOURCES.SELF],
    [CSP_DIRECTIVES.FONT_SRC]: [CSP_SOURCES.SELF, CSP_SOURCES.DATA],
    [CSP_DIRECTIVES.OBJECT_SRC]: [CSP_SOURCES.NONE],
    [CSP_DIRECTIVES.FRAME_SRC]: [CSP_SOURCES.NONE],
    [CSP_DIRECTIVES.BASE_URI]: [CSP_SOURCES.SELF],
    [CSP_DIRECTIVES.FORM_ACTION]: [CSP_SOURCES.SELF]
});

// Validate CSP directive
export const validateDirective = (directive) =>
    Object.values(CSP_DIRECTIVES).includes(directive)
        ? Either.Right(directive)
        : Either.Left(`Invalid CSP directive: ${directive}`);

// Validate CSP source
export const validateSource = (source) => {
    // Check if it's a keyword source
    if (Object.values(CSP_SOURCES).includes(source)) {
        return Either.Right(source);
    }
    
    // Check if it's a valid URL or scheme
    const urlPattern = /^(https?:\/\/[\w\-.]+(:\d+)?|[\w\-]+\.[\w\-]+|data:|blob:|filesystem:)/;
    const hostnamePattern = /^[\w\-.]+(:\d+)?$/;
    const schemePattern = /^[\w]+:$/;
    
    if (urlPattern.test(source) || hostnamePattern.test(source) || schemePattern.test(source)) {
        return Either.Right(source);
    }
    
    return Either.Left(`Invalid CSP source: ${source}`);
};

// Validate nonce value
export const validateNonce = (nonce) => {
    const noncePattern = /^[A-Za-z0-9+/=]{22,}$/;
    return noncePattern.test(nonce)
        ? Either.Right(`'nonce-${nonce}'`)
        : Either.Left('Invalid nonce format');
};

// Validate hash value
export const validateHash = (algorithm, hash) => {
    const validAlgorithms = ['sha256', 'sha384', 'sha512'];
    const hashPattern = /^[A-Za-z0-9+/=]+$/;
    
    if (!validAlgorithms.includes(algorithm)) {
        return Either.Left(`Invalid hash algorithm: ${algorithm}`);
    }
    
    if (!hashPattern.test(hash)) {
        return Either.Left('Invalid hash format');
    }
    
    return Either.Right(`'${algorithm}-${hash}'`);
};

// Create CSP policy object
export const createCSPPolicy = (customDirectives = {}) =>
    Result.fromTry(() => {
        const policy = { ...DEFAULT_CSP_POLICY };
        
        // Merge custom directives with validation
        Object.entries(customDirectives).forEach(([directive, sources]) => {
            const directiveValidation = validateDirective(directive);
            if (directiveValidation.type === 'Left') {
                throw new Error(directiveValidation.value);
            }
            
            const sourcesArray = Array.isArray(sources) ? sources : [sources];
            const validatedSources = sourcesArray.map(source => {
                const sourceValidation = validateSource(source);
                if (sourceValidation.type === 'Left') {
                    throw new Error(sourceValidation.value);
                }
                return sourceValidation.value;
            });
            
            policy[directive] = validatedSources;
        });
        
        return Object.freeze(policy);
    });

// Add source to directive
export const addSource = (directive, source, policy) =>
    validateDirective(directive)
        .chain(() => validateSource(source))
        .map(validSource => Object.freeze({
            ...policy,
            [directive]: [...(policy[directive] || []), validSource]
        }));

// Remove source from directive
export const removeSource = (directive, source, policy) =>
    validateDirective(directive)
        .map(() => Object.freeze({
            ...policy,
            [directive]: (policy[directive] || []).filter(s => s !== source)
        }));

// Set directive sources (replaces existing)
export const setDirective = (directive, sources, policy) =>
    validateDirective(directive)
        .map(() => {
            const sourcesArray = Array.isArray(sources) ? sources : [sources];
            const validatedSources = sourcesArray
                .map(source => validateSource(source))
                .filter(result => result.type === 'Right')
                .map(result => result.value);
            
            return Object.freeze({
                ...policy,
                [directive]: validatedSources
            });
        });

// Convert policy object to CSP header string
export const policyToString = (policy) =>
    Result.fromTry(() =>
        Object.entries(policy)
            .filter(([directive, sources]) => sources && sources.length > 0)
            .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
            .join('; ')
    );

// Apply CSP policy to document
export const applyCSPPolicy = (policy) => {
    const cspString = policyToString(policy);
    
    return cspString
        .map(csp => {
            // Create meta tag for CSP
            const metaTag = document.createElement('meta');
            metaTag.setAttribute('http-equiv', 'Content-Security-Policy');
            metaTag.setAttribute('content', csp);
            
            // Remove existing CSP meta tags
            const existingCSP = document.querySelectorAll('meta[http-equiv="Content-Security-Policy"]');
            existingCSP.forEach(tag => tag.remove());
            
            // Add new CSP meta tag
            document.head.appendChild(metaTag);
            
            return csp;
        });
};

// Generate secure nonce
export const generateNonce = () =>
    Result.fromTry(() => {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return btoa(String.fromCharCode.apply(null, array));
    });

// Generate content hash
export const generateContentHash = async (content, algorithm = 'sha256') => {
    const validAlgorithms = ['sha-256', 'sha-384', 'sha-512'];
    const algoMap = {
        'sha256': 'SHA-256',
        'sha384': 'SHA-384', 
        'sha512': 'SHA-512'
    };
    
    const cryptoAlgorithm = algoMap[algorithm];
    if (!cryptoAlgorithm) {
        return Result.Error(new Error(`Unsupported algorithm: ${algorithm}`));
    }
    
    try {
        const encoder = new TextEncoder();
        const data = encoder.encode(content);
        const hashBuffer = await crypto.subtle.digest(cryptoAlgorithm, data);
        const hashArray = new Uint8Array(hashBuffer);
        const hashBase64 = btoa(String.fromCharCode.apply(null, hashArray));
        
        return Result.Ok(`'${algorithm}-${hashBase64}'`);
    } catch (error) {
        return Result.Error(error);
    }
};

// CSP violation reporting
export const setupCSPReporting = (reportHandler) =>
    Result.fromTry(() => {
        document.addEventListener('securitypolicyviolation', (event) => {
            const violation = Object.freeze({
                blockedURI: event.blockedURI,
                columnNumber: event.columnNumber,
                disposition: event.disposition,
                documentURI: event.documentURI,
                effectiveDirective: event.effectiveDirective,
                lineNumber: event.lineNumber,
                originalPolicy: event.originalPolicy,
                referrer: event.referrer,
                sample: event.sample,
                sourceFile: event.sourceFile,
                statusCode: event.statusCode,
                violatedDirective: event.violatedDirective,
                timestamp: new Date().toISOString()
            });
            
            if (typeof reportHandler === 'function') {
                reportHandler(violation);
            } else {
                console.warn('CSP Violation:', violation);
            }
        });
        
        return 'CSP violation reporting enabled';
    });

// Predefined secure policies
export const SECURE_POLICIES = Object.freeze({
    STRICT: createCSPPolicy({
        [CSP_DIRECTIVES.DEFAULT_SRC]: [CSP_SOURCES.SELF],
        [CSP_DIRECTIVES.SCRIPT_SRC]: [CSP_SOURCES.SELF],
        [CSP_DIRECTIVES.STYLE_SRC]: [CSP_SOURCES.SELF],
        [CSP_DIRECTIVES.IMG_SRC]: [CSP_SOURCES.SELF],
        [CSP_DIRECTIVES.OBJECT_SRC]: [CSP_SOURCES.NONE],
        [CSP_DIRECTIVES.FRAME_SRC]: [CSP_SOURCES.NONE]
    }),
    
    DEVELOPMENT: createCSPPolicy({
        [CSP_DIRECTIVES.DEFAULT_SRC]: [CSP_SOURCES.SELF],
        [CSP_DIRECTIVES.SCRIPT_SRC]: [CSP_SOURCES.SELF, CSP_SOURCES.UNSAFE_EVAL],
        [CSP_DIRECTIVES.STYLE_SRC]: [CSP_SOURCES.SELF, CSP_SOURCES.UNSAFE_INLINE],
        [CSP_DIRECTIVES.IMG_SRC]: [CSP_SOURCES.SELF, CSP_SOURCES.DATA, CSP_SOURCES.BLOB]
    }),
    
    PRODUCTION: createCSPPolicy({
        [CSP_DIRECTIVES.DEFAULT_SRC]: [CSP_SOURCES.SELF],
        [CSP_DIRECTIVES.SCRIPT_SRC]: [CSP_SOURCES.SELF, CSP_SOURCES.STRICT_DYNAMIC],
        [CSP_DIRECTIVES.STYLE_SRC]: [CSP_SOURCES.SELF],
        [CSP_DIRECTIVES.IMG_SRC]: [CSP_SOURCES.SELF, CSP_SOURCES.DATA, CSP_SOURCES.HTTPS],
        [CSP_DIRECTIVES.OBJECT_SRC]: [CSP_SOURCES.NONE],
        [CSP_DIRECTIVES.BASE_URI]: [CSP_SOURCES.SELF]
    })
});

// Export CSP constants for external use
export { CSP_DIRECTIVES, CSP_SOURCES, DEFAULT_CSP_POLICY };
