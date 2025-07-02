import Maybe from '../../types/maybe.js';

// Element validation utilities
export const validateElement = (element) =>
    Maybe.fromNullable(element)
        .chain(el => el._isFlexNetElement ? Maybe.Just(el) : Maybe.Nothing())
        .chain(el => 
            el.type && el.props !== undefined
                ? Maybe.Just(el)
                : Maybe.Nothing()
        );
