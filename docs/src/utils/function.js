// === Function Utility Functions ===
// Pure functional programming utilities for function manipulation

import Maybe from '../core/types/maybe.js';
import { curry } from '../core/functions/composition.js';

/**
 * Creates a memoized version of a function for performance optimization
 * @param {Function} fn - The function to memoize
 * @returns {Function} Memoized function
 */
export const memoize = (fn) => {
    const cache = new Map();
    return (...args) => {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            return cache.get(key);
        }
        const result = fn(...args);
        cache.set(key, result);
        return result;
    };
};

/**
 * Creates a throttled version of a function
 * @param {Function} fn - The function to throttle
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (fn, delay) => {
    let timeoutId;
    let lastExecTime = 0;
    return (...args) => {
        const currentTime = Date.now();
        
        if (currentTime - lastExecTime > delay) {
            fn(...args);
            lastExecTime = currentTime;
        } else {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                fn(...args);
                lastExecTime = Date.now();
            }, delay - (currentTime - lastExecTime));
        }
    };
};

// Identity function - returns input unchanged
export const identity = x => x;

// Constant function - always returns the same value
export const constant = value => () => value;

// Debounce function execution
export const debounce = (fn, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
};

// Negate a predicate function
export const not = predicate => (...args) => !predicate(...args);
