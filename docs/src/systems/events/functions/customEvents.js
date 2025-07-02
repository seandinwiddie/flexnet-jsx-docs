import Either from '../../../core/types/either.js';
import Result from '../../../core/types/result.js';
import { curry } from '../../../core/functions/composition.js';

// Custom event creation
export const createCustomEvent = (type, detail = {}, options = {}) =>
    Result.fromTry(() => {
        // Functional custom event creation
        const eventConfig = {
            detail: Object.freeze(detail),
            bubbles: options.bubbles || false,
            cancelable: options.cancelable || false,
            composed: options.composed || false
        };
        
        // Use document.createEvent for constructor-free approach
        const event = document.createEvent('CustomEvent');
        event.initCustomEvent(type, eventConfig.bubbles, eventConfig.cancelable, eventConfig.detail);
        
        return event;
    });

export const dispatchCustomEvent = curry((element, event) =>
    Result.fromTry(() => {
        if (!element || !element.dispatchEvent) {
            return Either.Left('Invalid element');
        }
        
        return element.dispatchEvent(event);
    })
); 