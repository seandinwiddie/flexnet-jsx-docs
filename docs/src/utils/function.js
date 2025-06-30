// === Function Utility Functions ===
// Higher-order function utilities and helpers

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

// Throttle function execution
export const throttle = (fn, limit) => {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            fn.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// Negate a predicate function
export const not = predicate => (...args) => !predicate(...args);
