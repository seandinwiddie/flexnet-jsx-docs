import { curry } from '../../../core/functions/composition.js';

// ===========================================
// STATE LENS OPERATIONS
// ===========================================

export const createLens = (getter, setter) => Object.freeze({
    get: getter,
    set: setter,
    over: curry((fn, state) => setter(fn(getter(state)), state))
});

export const propertyLens = (property) =>
    createLens(
        state => state && state[property],
        (value, state) => ({ ...state, [property]: value })
    );

export const pathLens = (path) => {
    const pathArray = Array.isArray(path) ? path : path.split('.');
    
    const getter = (state) =>
        pathArray.reduce((current, key) => 
            current && current[key], state
        );
    
    const setter = (value, state) => {
        if (pathArray.length === 0) return value;
        if (pathArray.length === 1) return { ...state, [pathArray[0]]: value };
        
        const [head, ...tail] = pathArray;
        const nested = state[head] || {};
        
        return {
            ...state,
            [head]: pathLens(tail).set(value, nested)
        };
    };
    
    return createLens(getter, setter);
}; 