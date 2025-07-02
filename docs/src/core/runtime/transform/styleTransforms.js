import { pipe, curry } from '../../functions/composition.js';
import { addProp, removeProp } from './propsTransforms.js';

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
