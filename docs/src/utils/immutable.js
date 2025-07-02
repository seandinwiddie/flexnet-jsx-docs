// === Immutable Collections for FlexNet ===
// Pure functional alternatives to mutable Map and Set

import Either from '../core/types/either.js';
import Maybe from '../core/types/maybe.js';
import Result from '../core/types/result.js';

// ===========================================
// IMMUTABLE MAP IMPLEMENTATION
// ===========================================

export const ImmutableMap = {
    // Create empty map
    empty: () => Object.freeze({}),
    
    // Create map from entries
    fromEntries: (entries) =>
        Result.fromTry(() =>
            Object.freeze(
                entries.reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
            )
        ),
    
    // Set a key-value pair (returns new map)
    set: (key, value) => (map) =>
        Object.freeze({ ...map, [key]: value }),
    
    // Get a value by key
    get: (key) => (map) =>
        Maybe.fromNullable(map[key]),
    
    // Check if key exists
    has: (key) => (map) =>
        Object.prototype.hasOwnProperty.call(map, key),
    
    // Remove a key (returns new map)
    delete: (key) => (map) => {
        const { [key]: _, ...rest } = map;
        return Object.freeze(rest);
    },
    
    // Get all keys
    keys: (map) => Object.keys(map),
    
    // Get all values
    values: (map) => Object.values(map),
    
    // Get all entries
    entries: (map) => Object.entries(map),
    
    // Map over values
    map: (fn) => (map) =>
        Object.freeze(
            Object.fromEntries(
                Object.entries(map).map(([key, value]) => [key, fn(value)])
            )
        ),
    
    // Filter entries
    filter: (predicate) => (map) =>
        Object.freeze(
            Object.fromEntries(
                Object.entries(map).filter(([key, value]) => predicate(key, value))
            )
        ),
    
    // Size of map
    size: (map) => Object.keys(map).length
};

// ===========================================
// IMMUTABLE SET IMPLEMENTATION
// ===========================================

export const ImmutableSet = {
    // Create empty set
    empty: () => Object.freeze([]),
    
    // Create set from array
    fromArray: (array) =>
        Result.fromTry(() =>
            Object.freeze([...new Set(array)])
        ),
    
    // Add element (returns new set)
    add: (element) => (set) =>
        set.includes(element) 
            ? set 
            : Object.freeze([...set, element]),
    
    // Remove element (returns new set)
    delete: (element) => (set) =>
        Object.freeze(set.filter(item => item !== element)),
    
    // Check if element exists
    has: (element) => (set) =>
        set.includes(element),
    
    // Union of two sets
    union: (otherSet) => (set) =>
        Object.freeze([...new Set([...set, ...otherSet])]),
    
    // Intersection of two sets
    intersection: (otherSet) => (set) =>
        Object.freeze(set.filter(item => otherSet.includes(item))),
    
    // Difference of two sets
    difference: (otherSet) => (set) =>
        Object.freeze(set.filter(item => !otherSet.includes(item))),
    
    // Map over set
    map: (fn) => (set) =>
        Object.freeze([...new Set(set.map(fn))]),
    
    // Filter set
    filter: (predicate) => (set) =>
        Object.freeze(set.filter(predicate)),
    
    // Size of set
    size: (set) => set.length,
    
    // Convert to array
    toArray: (set) => [...set]
};

// ===========================================
// HELPER FUNCTIONS
// ===========================================

// Create immutable update function
export const updateImmutable = (path, updater) => (obj) => {
    const keys = path.split('.');
    
    const updateNested = (current, keyPath) => {
        if (keyPath.length === 0) {
            return updater(current);
        }
        
        const [head, ...tail] = keyPath;
        return {
            ...current,
            [head]: updateNested(current[head] || {}, tail)
        };
    };
    
    return Object.freeze(updateNested(obj, keys));
};

// Merge immutable objects
export const mergeImmutable = (...objects) =>
    Object.freeze(
        objects.reduce((acc, obj) => ({ ...acc, ...obj }), {})
    );

// Deep freeze utility
export const deepFreeze = (obj) => {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    
    Object.getOwnPropertyNames(obj).forEach(prop => {
        const value = obj[prop];
        if (value !== null && typeof value === 'object') {
            deepFreeze(value);
        }
    });
    
    return Object.freeze(obj);
}; 