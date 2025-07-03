// === Array Utilities ===
// Simple array manipulation functions

import Maybe from '../core/types/maybe.js';

// Get the first element of an array safely - matching documented API
export const head = array => Maybe.fromNullable(array[0]);

// Get all but the first element of an array - matching documented API  
export const tail = array => array.length > 1 ? Maybe.Just(array.slice(1)) : Maybe.Nothing();

export const last = arr => arr[arr.length - 1];
export const isEmpty = arr => arr.length === 0;

// === Array Utility Functions ===
// Functional array manipulation utilities

// Alternative names for compatibility
export const headSafe = head;
export const tailSafe = tail;

// Find an element matching a predicate
export const find = predicate => array => Maybe.fromNullable(array.find(predicate));
