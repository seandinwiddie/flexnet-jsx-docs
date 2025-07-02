import { curry } from '../../../core/functions/composition.js';

// === FlexNet Event Emitter Validation ===
// Simplified validation for events and listeners

// ===========================================
// VALIDATION FUNCTIONS
// ===========================================

export const validateEventName = (eventName) => {
    if (typeof eventName !== 'string' || eventName.length === 0) {
        return false;
    }
    return true;
};

export const validateListener = (listener) => {
    return typeof listener === 'function';
};

export const createListener = curry((eventName, handler, options = {}) => {
    if (!validateEventName(eventName)) {
        throw new Error('Event name must be a non-empty string');
    }
    
    if (!validateListener(handler)) {
        throw new Error('Listener must be a function');
    }
    
    return {
        eventName,
        handler,
        once: options.once || false,
        id: Math.random().toString(36).substr(2, 9)
    };
});
