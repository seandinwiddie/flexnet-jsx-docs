// === FlexNet Element Factory ===
// Pure functional element creation and management

import Maybe from '../types/maybe.js';
import Either from '../types/either.js';
import Result from '../types/result.js';
import { compose, pipe } from '../functions/composition.js';

// Core element creation function - pure and functional
export const createElement = (type, props = {}, ...children) => {
    // Validate element type
    const validateType = (elementType) => {
        if (typeof elementType === 'string' || typeof elementType === 'function') {
            return Either.Right(elementType);
        }
        return Either.Left('Invalid element type - must be string or function');
    };

    // Sanitize props to prevent XSS
    const sanitizeProps = (inputProps) => {
        const safeProps = Object.entries(inputProps || {}).reduce((acc, [key, value]) => {
            // Skip event handlers that are strings (potential XSS)
            if (key.startsWith('on') && typeof value === 'string') {
                return acc;
            }
            
            // Sanitize string values
            if (typeof value === 'string') {
                acc[key] = value.replace(/[<>&"']/g, (match) => {
                    const htmlEntities = {
                        '<': '&lt;',
                        '>': '&gt;',
                        '&': '&amp;',
                        '"': '&quot;',
                        "'": '&#039;'
                    };
                    return htmlEntities[match];
                });
            } else {
                acc[key] = value;
            }
            return acc;
        }, {});
        
        return Either.Right(safeProps);
    };

    // Flatten and validate children
    const processChildren = (childElements) => {
        const flattened = childElements.flat(Infinity).filter(child => child != null);
        return Either.Right(flattened);
    };

    // Create element structure
    const createElementStructure = (elementType, sanitizedProps, processedChildren) => ({
        type: elementType,
        props: {
            ...sanitizedProps,
            children: processedChildren
        },
        key: sanitizedProps.key || null,
        ref: sanitizedProps.ref || null
    });

    // Compose the element creation pipeline
    return pipe(
        () => validateType(type),
        typeResult => typeResult.chain(() => sanitizeProps(props)),
        propsResult => propsResult.chain(safeProps => 
            processChildren(children).map(processedChildren => 
                createElementStructure(type, safeProps, processedChildren)
            )
        )
    )();
};

// Fragment factory for grouping elements without wrapper
export const createFragment = (...children) => 
    createElement(Fragment, {}, ...children);

// Fragment component - pure function
export const Fragment = ({ children }) => children;

// Element type checking utilities
export const isElement = (obj) => 
    Maybe.fromNullable(obj)
        .map(element => element && typeof element === 'object' && element.type)
        .getOrElse(false);

export const isFragment = (element) =>
    Maybe.fromNullable(element)
        .map(el => el.type === Fragment)
        .getOrElse(false);

// Element cloning with new props - pure function
export const cloneElement = (element, newProps = {}, ...newChildren) => {
    if (!isElement(element)) {
        return Either.Left('Cannot clone non-element');
    }

    const mergedProps = {
        ...element.props,
        ...newProps,
        children: newChildren.length > 0 ? newChildren : element.props.children
    };

    return createElement(element.type, mergedProps);
};

// Element validation utilities
export const validateElement = (element) => {
    if (!element || typeof element !== 'object') {
        return Either.Left('Element must be an object');
    }

    if (!element.type) {
        return Either.Left('Element must have a type');
    }

    if (!element.props || typeof element.props !== 'object') {
        return Either.Left('Element must have props object');
    }

    return Either.Right(element);
};

// Export default factory function for JSX-like usage
export const flexnet = createElement;
export default createElement;
