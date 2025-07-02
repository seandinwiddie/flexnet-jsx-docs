import { curry } from '../../functions/composition.js';
import { addProp, removeProp } from './propsTransforms.js';

// Event handler transformations
export const addEventHandler = curry((eventName, handler, props) =>
    typeof handler === 'function'
        ? addProp(`on${eventName.charAt(0).toUpperCase()}${eventName.slice(1)}`, handler, props)
        : props
);

export const removeEventHandler = curry((eventName, props) =>
    removeProp(`on${eventName.charAt(0).toUpperCase()}${eventName.slice(1)}`, props)
);
