import { curry } from '../../../core/functions/composition.js';
import { createEventEmitter } from './createEventEmitter.js';

// Event bus for application-wide events
export const createEventBus = () => {
    const emitter = createEventEmitter();
    const middleware = [];
    
    return Object.freeze({
        // Add middleware for event processing
        use: (middlewareFn) => {
            if (typeof middlewareFn === 'function') {
                middleware.push(middlewareFn);
                return true;
            }
            return false;
        },
        
        // Emit event through middleware chain
        emit: curry((event, ...args) => {
            let processedEvent = { type: event, data: args };
            
            // Process through middleware
            for (const mw of middleware) {
                try {
                    const result = mw(processedEvent);
                    if (result) {
                        processedEvent = result;
                    }
                } catch (error) {
                    console.error('Event middleware error:', error);
                }
            }
            
            return emitter.emit(processedEvent.type, ...processedEvent.data);
        }),
        
        // Subscribe to events
        on: emitter.on,
        once: emitter.once,
        off: emitter.off,
        removeAllListeners: emitter.removeAllListeners,
        listenerCount: emitter.listenerCount,
        events: emitter.events
    });
}; 