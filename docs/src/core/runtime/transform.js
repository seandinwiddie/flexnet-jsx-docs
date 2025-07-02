// === FlexNet Runtime Transform ===
// Pure functional data transformation utilities for FlexNet runtime

import Maybe from '../types/maybe.js';
import Either from '../types/either.js';
import Result from '../types/result.js';
import { compose, pipe, curry } from '../functions/composition.js';

// Core transformation functions for FlexNet elements
export const transformElement = curry((transformFn, element) =>
    Maybe.fromNullable(element)
        .chain(el => 
            el._isFlexNetElement 
                ? Maybe.Just(transformFn(el))
                : Maybe.Nothing()
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

// Props transformation utilities
export const addProp = curry((key, value, props) =>
    Object.freeze({ ...props, [key]: value })
);

export const removeProp = curry((key, props) => {
    const { [key]: removed, ...rest } = props;
    return Object.freeze(rest);
});

export const updateProp = curry((key, updater, props) =>
    Maybe.fromNullable(props[key])
        .map(updater)
        .map(newValue => addProp(key, newValue, props))
        .getOrElse(props)
);

// CSS class transformation utilities
export const addClass = curry((className, props) =>
    pipe(
        props => props.className || '',
        existingClasses => existingClasses 
            ? `${existingClasses} ${className}`.trim()
            : className,
        newClasses => addProp('className', newClasses, props)
    )(props)
);

export const removeClass = curry((className, props) =>
    pipe(
        props => props.className || '',
        existingClasses => existingClasses
            .split(' ')
            .filter(cls => cls !== className)
            .join(' ')
            .trim(),
        newClasses => newClasses 
            ? addProp('className', newClasses, props)
            : removeProp('className', props)
    )(props)
);

export const toggleClass = curry((className, props) => {
    const existingClasses = (props.className || '').split(' ');
    return existingClasses.includes(className)
        ? removeClass(className, props)
        : addClass(className, props);
});

// Style transformation utilities
export const addStyle = curry((styleKey, styleValue, props) =>
    pipe(
        props => props.style || {},
        existingStyles => Object.freeze({
            ...existingStyles,
            [styleKey]: styleValue
        }),
        newStyles => addProp('style', newStyles, props)
    )(props)
);

export const removeStyle = curry((styleKey, props) =>
    pipe(
        props => props.style || {},
        existingStyles => {
            const { [styleKey]: removed, ...rest } = existingStyles;
            return Object.freeze(rest);
        },
        newStyles => Object.keys(newStyles).length > 0
            ? addProp('style', newStyles, props)
            : removeProp('style', props)
    )(props)
);

// Data attribute transformations
export const addDataAttribute = curry((key, value, props) =>
    addProp(`data-${key}`, value, props)
);

export const removeDataAttribute = curry((key, props) =>
    removeProp(`data-${key}`, props)
);

// Event handler transformations
export const addEventHandler = curry((eventName, handler, props) =>
    typeof handler === 'function'
        ? addProp(`on${eventName.charAt(0).toUpperCase()}${eventName.slice(1)}`, handler, props)
        : props
);

export const removeEventHandler = curry((eventName, props) =>
    removeProp(`on${eventName.charAt(0).toUpperCase()}${eventName.slice(1)}`, props)
);

// Conditional transformations
export const when = curry((predicate, transformer, element) =>
    predicate(element) 
        ? transformer(element)
        : element
);

export const unless = curry((predicate, transformer, element) =>
    when(element => !predicate(element), transformer, element)
);

// Element filtering and mapping
export const filterChildren = curry((predicate, element) =>
    transformChildren(children => 
        Array.isArray(children) 
            ? children.filter(predicate)
            : predicate(children) ? children : null
    , element)
);

export const mapChildren = curry((mapper, element) =>
    transformChildren(children =>
        Array.isArray(children)
            ? children.map(mapper)
            : mapper(children)
    , element)
);

// Element cloning with transformations
export const cloneElement = (element, propOverrides = {}, ...newChildren) =>
    Maybe.fromNullable(element)
        .chain(el => el._isFlexNetElement ? Maybe.Just(el) : Maybe.Nothing())
        .map(el => Object.freeze({
            ...el,
            props: Object.freeze({
                ...el.props,
                ...propOverrides,
                children: newChildren.length > 0 
                    ? Object.freeze(newChildren.flat(Infinity))
                    : el.props.children
            })
        }))
        .getOrElse(element);

// Serialization utilities for debugging
export const elementToString = (element) =>
    Maybe.fromNullable(element)
        .chain(el => el._isFlexNetElement ? Maybe.Just(el) : Maybe.Nothing())
        .map(el => {
            const type = typeof el.type === 'string' ? el.type : el.type.name || 'Component';
            const props = Object.entries(el.props)
                .filter(([key]) => key !== 'children')
                .map(([key, value]) => `${key}="${value}"`)
                .join(' ');
            const children = el.props.children || [];
            
            return children.length > 0
                ? `<${type}${props ? ' ' + props : ''}>${children.length} children</${type}>`
                : `<${type}${props ? ' ' + props : ''} />`;
        })
        .getOrElse('Invalid Element');

// Element validation utilities
export const validateElement = (element) =>
    Maybe.fromNullable(element)
        .chain(el => el._isFlexNetElement ? Maybe.Just(el) : Maybe.Nothing())
        .chain(el => 
            el.type && el.props !== undefined
                ? Maybe.Just(el)
                : Maybe.Nothing()
        );

// Composition helpers for chaining transformations
export const composeTransforms = (...transforms) =>
    element => transforms.reduce((acc, transform) => 
        Maybe.fromNullable(acc)
            .chain(transform)
            .getOrElse(acc)
    , element);

export const pipeTransforms = (...transforms) =>
    element => transforms.reduce((acc, transform) =>
        Maybe.fromNullable(acc)
            .chain(transform)
            .getOrElse(acc)
    , element);
