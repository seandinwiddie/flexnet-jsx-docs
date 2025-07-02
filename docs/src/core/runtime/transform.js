// === FlexNet Transform System ===
// Pure functional element transformation and processing

import Maybe from '../types/maybe.js';
import Either from '../types/either.js';
import Result from '../types/result.js';
import { compose, pipe } from '../functions/composition.js';

// Transform an element tree - pure function
export const transformElement = (transformer) => (element) => {
    if (!element || typeof element !== 'object') {
        return Either.Left('Invalid element for transformation');
    }

    const transformSingle = (elem) => {
        // Apply transformer to current element
        const transformedResult = transformer(elem);
        
        if (transformedResult.type === 'Left') {
            return transformedResult;
        }

        const transformed = transformedResult.value;

        // Recursively transform children if they exist
        if (transformed.props && transformed.props.children) {
            const transformedChildren = transformed.props.children.map(child => {
                if (typeof child === 'object' && child !== null) {
                    return transformElement(transformer)(child);
                }
                return Either.Right(child);
            });

            // Check if any child transformation failed
            const failed = transformedChildren.find(result => result.type === 'Left');
            if (failed) {
                return failed;
            }

            // Extract successful transformations
            const successfulChildren = transformedChildren.map(result => result.value);

            return Either.Right({
                ...transformed,
                props: {
                    ...transformed.props,
                    children: successfulChildren
                }
            });
        }

        return Either.Right(transformed);
    };

    return transformSingle(element);
};

// Map transformation over element children
export const mapChildren = (mapper) => (element) => {
    if (!element.props || !element.props.children) {
        return Either.Right(element);
    }

    const mappedChildren = element.props.children.map(mapper);
    
    return Either.Right({
        ...element,
        props: {
            ...element.props,
            children: mappedChildren
        }
    });
};

// Filter element children based on predicate
export const filterChildren = (predicate) => (element) => {
    if (!element.props || !element.props.children) {
        return Either.Right(element);
    }

    const filteredChildren = element.props.children.filter(predicate);
    
    return Either.Right({
        ...element,
        props: {
            ...element.props,
            children: filteredChildren
        }
    });
};

// Transform element props - pure function
export const transformProps = (propsTransformer) => (element) => {
    if (!element || !element.props) {
        return Either.Left('Element must have props to transform');
    }

    const transformedPropsResult = propsTransformer(element.props);
    
    if (transformedPropsResult.type === 'Left') {
        return transformedPropsResult;
    }

    return Either.Right({
        ...element,
        props: transformedPropsResult.value
    });
};

// Flatten nested element structures
export const flatten = (element) => {
    if (!element) {
        return Either.Right([]);
    }

    if (Array.isArray(element)) {
        const flattened = element.reduce((acc, child) => {
            const childResult = flatten(child);
            if (childResult.type === 'Right') {
                return acc.concat(childResult.value);
            }
            return acc;
        }, []);
        return Either.Right(flattened);
    }

    if (typeof element === 'object' && element.type) {
        return Either.Right([element]);
    }

    return Either.Right([element]);
};

// Normalize element structure - ensure consistent format
export const normalize = (element) => {
    if (element === null || element === undefined) {
        return Either.Right(null);
    }

    if (typeof element === 'string' || typeof element === 'number') {
        return Either.Right(element);
    }

    if (Array.isArray(element)) {
        const normalizedChildren = element.map(normalize);
        const failed = normalizedChildren.find(result => result.type === 'Left');
        if (failed) {
            return failed;
        }
        
        const successful = normalizedChildren.map(result => result.value);
        return Either.Right(successful);
    }

    if (typeof element === 'object' && element.type) {
        const normalizedProps = element.props || {};
        const normalizedChildren = normalizedProps.children || [];

        const childrenResult = normalize(normalizedChildren);
        if (childrenResult.type === 'Left') {
            return childrenResult;
        }

        return Either.Right({
            type: element.type,
            props: {
                ...normalizedProps,
                children: childrenResult.value
            },
            key: element.key || null,
            ref: element.ref || null
        });
    }

    return Either.Left('Unable to normalize element');
};

// Apply a series of transformations in sequence
export const applyTransformations = (transformations) => (element) => {
    return transformations.reduce((currentResult, transformation) => {
        if (currentResult.type === 'Left') {
            return currentResult;
        }
        return transformation(currentResult.value);
    }, Either.Right(element));
};

// Traverse element tree with visitor pattern
export const traverse = (visitor) => (element) => {
    const visitElement = (elem) => {
        // Visit current element
        const visitResult = visitor(elem);
        if (visitResult.type === 'Left') {
            return visitResult;
        }

        // Visit children if they exist
        if (elem.props && elem.props.children) {
            const childResults = elem.props.children.map(child => {
                if (typeof child === 'object' && child !== null && child.type) {
                    return traverse(visitor)(child);
                }
                return Either.Right(child);
            });

            const failed = childResults.find(result => result.type === 'Left');
            if (failed) {
                return failed;
            }
        }

        return visitResult;
    };

    return visitElement(element);
};

// Extract specific elements by type
export const extractByType = (targetType) => (element) => {
    const extracted = [];
    
    const extractor = (elem) => {
        if (elem.type === targetType) {
            extracted.push(elem);
        }
        return Either.Right(elem);
    };

    const result = traverse(extractor)(element);
    if (result.type === 'Left') {
        return result;
    }

    return Either.Right(extracted);
};

// Count elements by type
export const countByType = (targetType) => (element) => {
    let count = 0;
    
    const counter = (elem) => {
        if (elem.type === targetType) {
            count++;
        }
        return Either.Right(elem);
    };

    const result = traverse(counter)(element);
    if (result.type === 'Left') {
        return result;
    }

    return Either.Right(count);
};

// Compose multiple transformers into one
export const composeTransformers = (...transformers) => (element) => {
    return transformers.reduceRight((currentElement, transformer) => {
        if (currentElement.type === 'Left') {
            return currentElement;
        }
        return transformer(currentElement.value);
    }, Either.Right(element));
};

// Export transformation utilities
export const TransformUtils = {
    transformElement,
    mapChildren,
    filterChildren,
    transformProps,
    flatten,
    normalize,
    applyTransformations,
    traverse,
    extractByType,
    countByType,
    composeTransformers
};
