import { curry } from '../../../core/functions/composition.js';
import { updateProperty } from './propertyOperations.js';

// ===========================================
// ARRAY STATE OPERATIONS
// ===========================================

export const appendToArray = curry((property, item, state) =>
    updateProperty(property, arr => 
        Array.isArray(arr) ? [...arr, item] : [item]
    , state)
);

export const prependToArray = curry((property, item, state) =>
    updateProperty(property, arr =>
        Array.isArray(arr) ? [item, ...arr] : [item]
    , state)
);

export const removeFromArray = curry((property, predicate, state) =>
    updateProperty(property, arr =>
        Array.isArray(arr) ? arr.filter(item => !predicate(item)) : []
    , state)
);

export const updateArrayItem = curry((property, predicate, updater, state) =>
    updateProperty(property, arr =>
        Array.isArray(arr) 
            ? arr.map(item => predicate(item) ? updater(item) : item)
            : []
    , state)
); 