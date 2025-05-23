import Either from '../types/either.js';
import Result from '../types/result.js';
import { 
    validateElementType, 
    sanitizeProps, 
    safeDOMOperation,
    escape 
} from '../security/functions.js';

// Secure JSX runtime implementation
const createElement = (type, props, ...children) => {
    // Validate element type
    const typeValidation = validateElementType(type);
    if (typeValidation.type === 'Left') {
        return Either.Left(typeValidation.value);
    }

    // Sanitize props
    const propsResult = sanitizeProps(props);
    if (propsResult.type === 'Error') {
        return Either.Left('Props sanitization failed');
    }

    // Flatten and validate children
    const flatChildren = children.flat().filter(child => child != null);
    
    return Either.Right({
        type,
        props: { ...propsResult.value, children: flatChildren }
    });
};

const jsx = createElement;

// Secure render function with proper DOM handling
const render = (element, container) => {
    return safeDOMOperation(() => {
        if (!container) {
            throw new Error('Container element not found');
        }

        // Clear container safely without innerHTML
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        
        // Handle Either type from createElement
        if (element && element.type === 'Left') {
            const errorElement = createTextNode(`Error: ${element.value}`);
            container.appendChild(errorElement);
            return Either.Left(element.value);
        }

        // Extract the actual element from Either.Right
        const actualElement = element && element.type === 'Right' ? element.value : element;
        
        // Create DOM element from JSX
        const domElementResult = createDOMElement(actualElement);
        
        if (domElementResult.type === 'Error') {
            const errorElement = createTextNode(`Render Error: ${domElementResult.error.message}`);
            container.appendChild(errorElement);
            return Either.Left(domElementResult.error);
        }

        const domElement = domElementResult.value;
        
        if (domElement) {
            container.appendChild(domElement);
        }

        return Either.Right(domElement);
    });
};

// Helper to create text nodes safely
const createTextNode = (text) => {
    const escapedText = typeof text === 'string' ? escape(text) : String(text);
    return document.createTextNode(escapedText);
};

// Secure DOM element creation with error handling
const createDOMElement = (element) => {
    return safeDOMOperation(() => {
        if (typeof element === 'string' || typeof element === 'number') {
            return createTextNode(element);
        }
        
        if (!element) {
            return document.createTextNode('');
        }
        
        if (typeof element.type === 'function') {
            // Handle functional components with error boundary
            const componentResult = Result.fromTry(() => element.type(element.props));
            if (componentResult.type === 'Error') {
                throw new Error(`Component error: ${componentResult.error.message}`);
            }
            const nestedResult = createDOMElement(componentResult.value);
            if (nestedResult.type === 'Error') {
                throw nestedResult.error;
            }
            return nestedResult.value;
        }
        
        // Validate element type
        if (typeof element.type !== 'string') {
            throw new Error('Invalid element type');
        }
        
        // Create the DOM element safely
        const domElement = document.createElement(element.type);
        
        // Add props/attributes safely
        const { children, ...props } = element.props || {};
        
        // Set properties and event handlers with validation
        Object.entries(props || {}).forEach(([name, value]) => {
            if (name.startsWith('on') && typeof value === 'function') {
                // Event handlers - ensure they're functions
                const eventName = name.toLowerCase().substring(2);
                domElement.addEventListener(eventName, (event) => {
                    // Wrap event handler in error boundary
                    Result.fromTry(() => value(event))
                        .map(() => {}) // Success case
                        .chain(result => result.type === 'Error' 
                            ? Either.Left(`Event handler error: ${result.error.message}`)
                            : Either.Right(result));
                });
            } else if (name === 'style' && typeof value === 'string') {
                // Handle inline styles safely
                domElement.setAttribute('style', escape(value));
            } else if (typeof value === 'string') {
                // Regular attributes - escape string values
                domElement.setAttribute(name, escape(value));
            } else if (typeof value === 'boolean') {
                // Boolean attributes
                if (value) {
                    domElement.setAttribute(name, '');
                }
            } else if (typeof value === 'number') {
                // Numeric attributes
                domElement.setAttribute(name, String(value));
            }
        });
        
        // Add children safely
        (children || []).forEach(child => {
            // Handle Either.Right wrapped children (from createElement)
            let actualChild = child;
            if (child && child.type === 'Right') {
                actualChild = child.value;
            }
            
            const childResult = createDOMElement(actualChild);
            if (childResult.type === 'Error') {
                // Create error placeholder instead of failing completely
                const errorNode = document.createTextNode(`[Child Error: ${childResult.error.message}]`);
                domElement.appendChild(errorNode);
            } else {
                domElement.appendChild(childResult.value);
            }
        });
        
        return domElement;
    });
};

export { createElement, jsx, render }; 