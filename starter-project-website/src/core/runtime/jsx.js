import Either from '../types/either.js';
import Result from '../types/result.js';
import { 
    validateElementType, 
    sanitizeProps, 
    safeDOMOperation,
    escape 
} from '../security/functions.js';

// Enhanced safety wrapper to prevent undefined type access
const safeTypeCheck = (obj, expectedType) => {
    try {
        return obj !== null && 
               obj !== undefined && 
               typeof obj === 'object' && 
               obj.hasOwnProperty('type') && 
               obj.type === expectedType;
    } catch (error) {
        return false;
    }
};

// Wrapper function for accessing .type property safely
const safeGetType = (obj) => {
    try {
        return obj && typeof obj === 'object' && obj.hasOwnProperty('type') ? obj.type : null;
    } catch (error) {
        return null;
    }
};

// Enhanced error logging with more context
const logSafeError = (context, error, additionalInfo = '') => {
    const timestamp = new Date().toISOString();
    const errorMessage = error && error.message ? error.message : String(error);
    const contextInfo = additionalInfo ? ` | Additional Info: ${additionalInfo}` : '';
    console.error(`[${timestamp}] FlexNet JSX Error in ${context}: ${errorMessage}${contextInfo}`);
    if (error && error.stack) {
        console.error('Stack trace:', error.stack);
    }
};

// Secure JSX runtime implementation
const createElement = (type, props, ...children) => {
    try {
        // Validate element type
        const typeValidation = validateElementType(type);
        if (safeTypeCheck(typeValidation, 'Left')) {
            logSafeError('createElement', typeValidation.value, `Failed to validate element type: ${type}`);
            return Either.Left(typeValidation.value);
        }

        // Sanitize props
        const propsResult = sanitizeProps(props);
        if (safeTypeCheck(propsResult, 'Error')) {
            logSafeError('createElement', 'Props sanitization failed', `Props: ${JSON.stringify(props)}`);
            return Either.Left('Props sanitization failed');
        }

        // Flatten and validate children
        const flatChildren = children.flat().filter(child => child != null);
        
        return Either.Right({
            type,
            props: { ...(safeTypeCheck(propsResult, 'Ok') ? propsResult.value : {}), children: flatChildren }
        });
    } catch (error) {
        logSafeError('createElement', error, `Element type: ${type}, Props: ${JSON.stringify(props)}`);
        return Either.Left(`createElement failed: ${error.message}`);
    }
};

const jsx = createElement;

// Secure render function with proper DOM handling
const render = (element, container) => {
    try {
        return safeDOMOperation(() => {
            if (!container) {
                throw new Error('Container element not found');
            }

            // Clear container safely without innerHTML
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }
            
            // Handle Either type from createElement
            if (safeTypeCheck(element, 'Left')) {
                const errorElement = createTextNode(`Error: ${element.value}`);
                container.appendChild(errorElement);
                logSafeError('render', element.value, 'Element contains Left value from createElement');
                return Either.Left(element.value);
            }

            // Extract the actual element from Either.Right
            const actualElement = safeTypeCheck(element, 'Right') ? element.value : element;
            
            // Create DOM element from JSX
            const domElementResult = createDOMElement(actualElement);
            
            if (safeTypeCheck(domElementResult, 'Error')) {
                const errorElement = createTextNode(`Render Error: ${domElementResult.error.message || domElementResult.error}`);
                container.appendChild(errorElement);
                logSafeError('render', domElementResult.error, 'Failed to create DOM element during render');
                return Either.Left(domElementResult.error);
            }

            const domElement = domElementResult && domElementResult.value ? domElementResult.value : null;
            
            if (domElement) {
                container.appendChild(domElement);
            }

            return Either.Right(domElement);
        });
    } catch (error) {
        logSafeError('render', error, `Container ID: ${container ? container.id || 'no-id' : 'null'}`);
        return Either.Left(error);
    }
};

// Helper to create text nodes safely
const createTextNode = (text) => {
    try {
        const escapedText = typeof text === 'string' ? escape(text) : String(text || '');
        return document.createTextNode(escapedText);
    } catch (error) {
        logSafeError('createTextNode', error, `Input text type: ${typeof text}, value: ${text}`);
        return document.createTextNode('[Text Error]');
    }
};

// Secure DOM element creation with error handling
const createDOMElement = (element) => {
    try {
        return safeDOMOperation(() => {
            if (element === null || element === undefined) {
                return createTextNode(''); // Handle null/undefined gracefully
            }
            if (typeof element === 'string' || typeof element === 'number') {
                return createTextNode(element);
            }
            
            // Ensure element is an object before trying to access type
            if (typeof element !== 'object') {
                logSafeError('createDOMElement', `Invalid element: expected object, got ${typeof element}`, `Element value: ${element}`);
                return createTextNode('[Invalid Element]'); 
            }
            
            // Check for element.type safely
            const elementType = safeGetType(element) || (element && element.type);
            
            if (typeof elementType === 'function') {
                // Handle functional components with error boundary
                const componentResult = Result.fromTry(() => elementType(element.props || {})); // Pass empty props if undefined
                if (safeTypeCheck(componentResult, 'Error')) {
                    logSafeError('createDOMElement-functional-component', componentResult.error, `Component function: ${elementType.name || 'anonymous'}`);
                    throw new Error(`Component error: ${componentResult.error.message || componentResult.error}`);
                }
                // Ensure componentResult.value is not undefined before recursion
                const nestedElement = componentResult && componentResult.value ? componentResult.value : null;
                const nestedResult = createDOMElement(nestedElement);
                if (safeTypeCheck(nestedResult, 'Error')) {
                    logSafeError('createDOMElement-functional-nested', nestedResult.error, `Nested element from component: ${elementType.name || 'anonymous'}`);
                    throw nestedResult.error;
                }
                return nestedResult && nestedResult.value ? nestedResult.value : createTextNode('[Empty Component]');
            }
            
            // Validate element type
            if (typeof elementType !== 'string') {
                logSafeError('createDOMElement', `Invalid element type: ${typeof elementType} for element ${JSON.stringify(element)}`, `Expected string element type for DOM creation`);
                throw new Error(`Invalid element type: ${typeof elementType}`);
            }
            
            // Create the DOM element safely
            const domElement = document.createElement(elementType);
            
            // Add props/attributes safely
            const { children, ...props } = element.props || {};
            
            // Set properties and event handlers with validation
            Object.entries(props || {}).forEach(([name, value]) => {
                try {
                    if (name.startsWith('on') && typeof value === 'function') {
                        // Event handlers - ensure they're functions
                        const eventName = name.toLowerCase().substring(2);
                        domElement.addEventListener(eventName, (event) => {
                            // Wrap event handler in error boundary
                            const handlerResult = Result.fromTry(() => value(event));
                            if (safeTypeCheck(handlerResult, 'Error')) {
                                logSafeError('eventHandler', handlerResult.error, `Event: ${eventName}, Element: ${elementType}`);
                            }
                        });
                    } else if (name === 'className') {
                        // Handle className prop and convert to class attribute
                        if (typeof value === 'string') {
                            domElement.setAttribute('class', escape(value));
                        }
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
                } catch (error) {
                    logSafeError('setAttribute', error, `Attribute: ${name}, Value: ${value}, Element: ${elementType}`);
                }
            });
            
            // Add children safely
            (children || []).forEach((child, index) => {
                try {
                    // Handle Either.Right wrapped children (from createElement)
                    let actualChild = child;
                    if (safeTypeCheck(child, 'Right')) {
                        actualChild = child.value;
                    }
                    
                    const childResult = createDOMElement(actualChild);
                    if (safeTypeCheck(childResult, 'Error')) {
                        // Create error placeholder instead of failing completely
                        const errorMessage = childResult.error && childResult.error.message || childResult.error || 'Unknown error';
                        const errorNode = document.createTextNode(`[Child Error: ${errorMessage}]`);
                        domElement.appendChild(errorNode);
                        logSafeError('appendChild-child-error', childResult.error, `Parent element: ${elementType}, Child index: ${index}`);
                    } else if (childResult && childResult.value) {
                        domElement.appendChild(childResult.value);
                    }
                } catch (error) {
                    logSafeError('appendChild', error, `Parent element: ${elementType}, Child: ${child}, Child index: ${index}`);
                    const errorNode = document.createTextNode('[Child Error]');
                    domElement.appendChild(errorNode);
                }
            });
            
            return domElement;
        });
    } catch (error) {
        logSafeError('createDOMElement', error, `Element: ${JSON.stringify(element)}`);
        return Result.Error(error);
    }
};

export { createElement, jsx, render }; 