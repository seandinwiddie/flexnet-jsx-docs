import Maybe from '../../../core/types/maybe.js';
import { curry } from '../../../core/functions/composition.js';

// ===========================================
// PROPERTY OPERATIONS
// ===========================================

// Composable state updates
export const updateProperty = curry((property, updater, state) =>
    Maybe.fromNullable(state)
        .map(s => ({
            ...s,
            [property]: typeof updater === 'function' 
                ? updater(s[property])
                : updater
        }))
        .getOrElse(state)
);

export const setProperty = curry((property, value, state) =>
    updateProperty(property, () => value, state)
);

export const deleteProperty = curry((property, state) => {
    if (!state || typeof state !== 'object') {
        return state;
    }
    
    const { [property]: deleted, ...rest } = state;
    return rest;
}); 