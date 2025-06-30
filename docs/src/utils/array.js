// === Array Utility Functions ===
// Functional array manipulation utilities

import Maybe from '../core/types/maybe.js';

// Get the first element of an array safely
export const head = array => Maybe.fromNullable(array[0]);

// Get all but the first element of an array
export const tail = array => array.length > 1 ? Maybe.Just(array.slice(1)) : Maybe.Nothing();

// Find an element matching a predicate
export const find = predicate => array => Maybe.fromNullable(array.find(predicate));
