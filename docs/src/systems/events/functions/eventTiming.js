import { curry } from '../../../core/functions/composition.js';

// Debounce and throttle utilities
export const debounceEvent = curry((delay, handler) => {
    let timeoutId = null;
    
    return (event) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        
        timeoutId = setTimeout(() => {
            handler(event);
            timeoutId = null;
        }, delay);
    };
});

export const throttleEvent = curry((delay, handler) => {
    let lastCall = 0;
    let timeoutId = null;
    
    return (event) => {
        const now = Date.now();
        
        if (now - lastCall >= delay) {
            lastCall = now;
            handler(event);
        } else if (!timeoutId) {
            timeoutId = setTimeout(() => {
                lastCall = Date.now();
                handler(event);
                timeoutId = null;
            }, delay - (now - lastCall));
        }
    };
}); 