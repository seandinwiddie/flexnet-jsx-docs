import Either from '../../../core/types/either.js';
import Result from '../../../core/types/result.js';
import { curry } from '../../../core/functions/composition.js';

// DOM event handling utilities
export const addDOMListener = curry((element, event, handler, options = {}) =>
    Result.fromTry(() => {
        if (!element || !element.addEventListener) {
            return Either.Left('Invalid element');
        }
        
        if (typeof handler !== 'function') {
            return Either.Left('Handler must be a function');
        }
        
        // Add event listener with options
        element.addEventListener(event, handler, options);
        
        // Return cleanup function
        return () => {
            element.removeEventListener(event, handler, options);
            return true;
        };
    })
);

export const removeDOMListener = curry((element, event, handler, options = {}) =>
    Result.fromTry(() => {
        if (!element || !element.removeEventListener) {
            return Either.Left('Invalid element');
        }
        
        element.removeEventListener(event, handler, options);
        return true;
    })
); 