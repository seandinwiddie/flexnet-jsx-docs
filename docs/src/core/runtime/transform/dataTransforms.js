import { curry } from '../../functions/composition.js';
import { addProp, removeProp } from './propsTransforms.js';

// Data attribute transformations
export const addDataAttribute = curry((key, value, props) =>
    addProp(`data-${key}`, value, props)
);

export const removeDataAttribute = curry((key, props) =>
    removeProp(`data-${key}`, props)
);
