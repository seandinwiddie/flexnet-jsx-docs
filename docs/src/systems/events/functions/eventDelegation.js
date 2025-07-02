import Either from '../../../core/types/either.js';
import Result from '../../../core/types/result.js';
import { curry } from '../../../core/functions/composition.js';

// Event delegation utilities
export const delegateEvent = curry((container, selector, event, handler) =>
    Result.fromTry(() => {
        if (!container || !container.addEventListener) {
            return Either.Left('Invalid container element');
        }
        
        const delegatedHandler = (e) => {
            const target = e.target.closest(selector);
            if (target && container.contains(target)) {
                handler.call(target, e);
            }
        };
        
        container.addEventListener(event, delegatedHandler);
        
        // Return cleanup function
        return () => {
            container.removeEventListener(event, delegatedHandler);
            return true;
        };
    })
); 