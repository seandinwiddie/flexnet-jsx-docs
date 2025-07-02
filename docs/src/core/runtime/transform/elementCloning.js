import Maybe from '../../types/maybe.js';

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
