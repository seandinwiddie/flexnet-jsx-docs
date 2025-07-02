import { curry } from '../../../core/functions/composition.js';
import { updateProperty } from './propertyOperations.js';

// ===========================================
// OBJECT STATE OPERATIONS
// ===========================================

export const mergeObject = curry((property, objectToMerge, state) =>
    updateProperty(property, obj =>
        obj && typeof obj === 'object'
            ? { ...obj, ...objectToMerge }
            : objectToMerge
    , state)
); 