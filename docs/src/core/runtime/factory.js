// === FlexNet Runtime Factory ===
// Pure functional component factory for creating FlexNet elements

import Maybe from '../types/maybe.js';
import Either from '../types/either.js';
import Result from '../types/result.js';
import { compose, pipe } from '../functions/composition.js';

// Core element creation factory - pure function
export const createElement = (type, props = {}, ...children) => {
    // Validate element type
    const validateType = (elementType) =>
        typeof elementType === 'string' || typeof elementType === 'function'
            ? Either.Right(elementType)
            : Either.Left('Invalid element type: must be string or function');

    // Sanitize and validate props
    const validateProps = (properties) =>
        Maybe.fromNullable(properties)
            .map(p => typeof p === 'object' && p !== null ? p : {})
            .map(p => Object.freeze({ ...p })) // Immutable props
            .getOrElse({});

    // Flatten and validate children
    const validateChildren = (childArray) =>
        Result.fromTry(() => 
            childArray
                .flat(Infinity)
                .filter(child => child !== null && child !== undefined)
                .map(child => 
                    typeof child === 'string' || typeof child === 'number'
                        ? String(child)
                        : child
                )
        );

    // Pure element factory function
    const createElementData = (validType, validProps, validChildren) => ({
        type: validType,
        props: Object.freeze({
            ...validProps,
            children: Object.freeze(validChildren)
        }),
        key: validProps.key || null,
        ref: validProps.ref || null,
        _isFlexNetElement: true
    });

    // Compose the element creation pipeline
    return pipe(
        validateType,
        Either.chain(validType =>
            validateChildren(children)
                .map(validChildren => 
                    createElementData(
                        validType,
                        validateProps(props),
                        validChildren
                    )
                )
        )
    )(type);
};

// Fragment factory for grouping elements without wrapper
export const createFragment = (...children) =>
    createElement(FlexNetFragment, {}, ...children);

// FlexNet Fragment component
const FlexNetFragment = ({ children }) => children;

// Component factory for creating reusable components
export const createComponent = (displayName) => (renderFunction) => {
    // Validate render function is pure
    const validateRenderFunction = (fn) =>
        typeof fn === 'function'
            ? Either.Right(fn)
            : Either.Left('Render function must be a function');

    return validateRenderFunction(renderFunction)
        .map(validRenderFn => {
            const Component = (props = {}) => {
                // Ensure props are immutable
                const immutableProps = Object.freeze({ ...props });
                
                // Call render function with immutable props
                return Result.fromTry(() => validRenderFn(immutableProps))
                    .chain(result => 
                        result && typeof result === 'object'
                            ? Result.Ok(result)
                            : Result.Error('Component must return valid element')
                    );
            };
            
            // Set display name for debugging
            Component.displayName = displayName || 'FlexNetComponent';
            Component._isFlexNetComponent = true;
            
            return Component;
        });
};

// Higher-order component factory
export const withProps = (defaultProps) => (Component) =>
    createComponent(`WithProps(${Component.displayName || 'Component'})`)
        ((props) => {
            const mergedProps = Object.freeze({
                ...defaultProps,
                ...props
            });
            return Component(mergedProps);
        });

// Memo factory for optimized components
export const memo = (Component, areEqual = Object.is) =>
    createComponent(`Memo(${Component.displayName || 'Component'})`)
        ((props) => {
            // Simple memoization - in real implementation would use proper caching
            return Component(props);
        });

// Validation utilities
export const isFlexNetElement = (element) =>
    Maybe.fromNullable(element)
        .map(el => Boolean(el._isFlexNetElement))
        .getOrElse(false);

export const isFlexNetComponent = (component) =>
    Maybe.fromNullable(component)
        .map(comp => Boolean(comp._isFlexNetComponent))
        .getOrElse(false);

// Element type checking utilities
export const getElementType = (element) =>
    Maybe.fromNullable(element)
        .chain(el => isFlexNetElement(el) ? Maybe.Just(el.type) : Maybe.Nothing());

export const getElementProps = (element) =>
    Maybe.fromNullable(element)
        .chain(el => isFlexNetElement(el) ? Maybe.Just(el.props) : Maybe.Nothing());

export const getElementChildren = (element) =>
    getElementProps(element)
        .map(props => props.children || []);
