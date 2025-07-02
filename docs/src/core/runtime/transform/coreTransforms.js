import Maybe from '../../types/maybe.js';
import Result from '../../types/result.js';
import { compose, pipe, curry } from '../../functions/composition.js';

// Core transformation functions for FlexNet elements
export const transformElement = curry((transformFn, element) =>
    Maybe.fromNullable(element)
        .chain(el => 
            el._isFlexNetElement 
                ? Maybe.Just(transformFn(el))
                : Maybe.Nothing()
        )
);

// Apply transformation safely to any element
export const applyTransformation = curry((transformation, element) =>
    Result.fromTry(() => transformation(element))
        .fold(
            error => {
                console.warn('Transformation failed:', error);
                return element; // Return original element on error
            },
            result => result
        )
);

// Transform element props while maintaining immutability
export const transformProps = curry((propTransformer, element) =>
    Maybe.fromNullable(element)
        .chain(el => el._isFlexNetElement ? Maybe.Just(el) : Maybe.Nothing())
        .map(el => ({
            ...el,
            props: Object.freeze({
                ...el.props,
                ...propTransformer(el.props)
            })
        }))
        .map(Object.freeze)
);

// Transform element children recursively
export const transformChildren = curry((childTransformer, element) =>
    Maybe.fromNullable(element)
        .chain(el => el._isFlexNetElement ? Maybe.Just(el) : Maybe.Nothing())
        .map(el => ({
            ...el,
            props: Object.freeze({
                ...el.props,
                children: Object.freeze(
                    (el.props.children || []).map(childTransformer)
                )
            })
        }))
        .map(Object.freeze)
);

// Deep transformation of element tree
export const transformTree = curry((elementTransformer, childTransformer, element) =>
    pipe(
        transformElement(elementTransformer),
        Maybe.chain(transformChildren(child =>
            child && typeof child === 'object' && child._isFlexNetElement
                ? transformTree(elementTransformer, childTransformer, child)
                : childTransformer(child)
        ))
    )(element)
);
