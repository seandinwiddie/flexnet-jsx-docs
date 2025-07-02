// === Array Utilities ===
// Simple array manipulation functions

export const head = arr => arr[0];
export const tail = arr => arr.slice(1);
export const last = arr => arr[arr.length - 1];
export const isEmpty = arr => arr.length === 0;

// === Array Utility Functions ===
// Functional array manipulation utilities

import Maybe from '../core/types/maybe.js';

// Get the first element of an array safely
export const headSafe = array => Maybe.fromNullable(array[0]);

// Get all but the first element of an array
export const tailSafe = array => array.length > 1 ? Maybe.Just(array.slice(1)) : Maybe.Nothing();

// Find an element matching a predicate
export const find = predicate => array => Maybe.fromNullable(array.find(predicate));
