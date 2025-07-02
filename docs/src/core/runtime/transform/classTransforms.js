import { pipe, curry } from '../../functions/composition.js';
import { addProp, removeProp } from './propsTransforms.js';

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
