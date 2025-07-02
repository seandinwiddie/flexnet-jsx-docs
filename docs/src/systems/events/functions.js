// === FlexNet Event System ===
// Pure functional event handling and composition

import Maybe from '../../core/types/maybe.js';
import Either from '../../core/types/either.js';
import Result from '../../core/types/result.js';
import { compose, pipe } from '../../core/functions/composition.js';

// Create event bus with pure functional interface
export const createEventBus = () => {
    const subscribers = new Map();
    const middleware = [];

    const eventBus = {
        // Subscribe to events - returns unsubscribe function
        on: (eventType, handler) => {
            if (typeof eventType !== 'string' || !eventType.trim()) {
                return Either.Left('Event type must be a non-empty string');
            }

            if (typeof handler !== 'function') {
                return Either.Left('Event handler must be a function');
            }

            const existingHandlers = subscribers.get(eventType) || [];
            const newHandlers = [...existingHandlers, handler];
            subscribers.set(eventType, newHandlers);

            // Return unsubscribe function
            const unsubscribe = () => {
                const currentHandlers = subscribers.get(eventType) || [];
                const filteredHandlers = currentHandlers.filter(h => h !== handler);
                
                if (filteredHandlers.length === 0) {
                    subscribers.delete(eventType);
                } else {
                    subscribers.set(eventType, filteredHandlers);
                }
            };

            return Either.Right(unsubscribe);
        },

        // Subscribe to events only once
        once: (eventType, handler) => {
            if (typeof eventType !== 'string' || !eventType.trim()) {
                return Either.Left('Event type must be a non-empty string');
            }

            if (typeof handler !== 'function') {
                return Either.Left('Event handler must be a function');
            }

            const wrappedHandler = (event) => {
                handler(event);
                unsubscribe();
            };

            const subscribeResult = eventBus.on(eventType, wrappedHandler);
            
            if (subscribeResult.type === 'Left') {
                return subscribeResult;
            }

            const unsubscribe = subscribeResult.value;
            return Either.Right(unsubscribe);
        },

        // Emit events with middleware processing
        emit: (eventType, eventData = {}) => {
            if (typeof eventType !== 'string' || !eventType.trim()) {
                return Either.Left('Event type must be a non-empty string');
            }

            // Create event object
            const event = Object.freeze({
                type: eventType,
                data: eventData,
                timestamp: Date.now(),
                id: generateEventId()
            });

            // Apply middleware
            const processedEventResult = applyEventMiddleware(middleware, event);
            
            if (processedEventResult.type === 'Left') {
                return processedEventResult;
            }

            const processedEvent = processedEventResult.value;

            // Get handlers for this event type
            const handlers = subscribers.get(eventType) || [];

            // Execute handlers with error isolation
            const results = handlers.map(handler => {
                return Result.fromTry(() => handler(processedEvent));
            });

            // Check for handler errors
            const errors = results.filter(result => result.type === 'Error');
            
            if (errors.length > 0) {
                return Either.Left(`Event handler errors: ${errors.map(e => e.error.message).join(', ')}`);
            }

            return Either.Right({
                eventType,
                handlersExecuted: handlers.length,
                event: processedEvent
            });
        },

        // Add middleware
        use: (middlewareFn) => {
            if (typeof middlewareFn !== 'function') {
                return Either.Left('Middleware must be a function');
            }

            middleware.push(middlewareFn);
            return Either.Right(eventBus);
        },

        // Remove all listeners for event type
        off: (eventType) => {
            if (typeof eventType !== 'string') {
                return Either.Left('Event type must be a string');
            }

            const hadListeners = subscribers.has(eventType);
            subscribers.delete(eventType);
            
            return Either.Right(hadListeners);
        },

        // Get event bus statistics
        getStats: () => Either.Right({
            totalEventTypes: subscribers.size,
            totalHandlers: Array.from(subscribers.values()).reduce((sum, handlers) => sum + handlers.length, 0),
            middlewareCount: middleware.length,
            eventTypes: Array.from(subscribers.keys())
        })
    };

    return Either.Right(eventBus);
};

// Apply middleware to event
const applyEventMiddleware = (middlewareList, event) => {
    return middlewareList.reduce((currentEvent, middleware) => {
        if (currentEvent.type === 'Left') {
            return currentEvent;
        }

        const middlewareResult = Result.fromTry(() => middleware(currentEvent.value));
        
        if (middlewareResult.type === 'Error') {
            return Either.Left(`Middleware error: ${middlewareResult.error.message}`);
        }

        return Either.Right(middlewareResult.value);
    }, Either.Right(event));
};

// Generate unique event ID
const generateEventId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Event composition utilities
export const composeEventHandlers = (...handlers) => {
    if (handlers.length === 0) {
        return Either.Left('Cannot compose empty handlers');
    }

    const invalidHandler = handlers.find(handler => typeof handler !== 'function');
    if (invalidHandler) {
        return Either.Left('All handlers must be functions');
    }

    const composedHandler = (event) => {
        const results = handlers.map(handler => Result.fromTry(() => handler(event)));
        
        const errors = results.filter(result => result.type === 'Error');
        if (errors.length > 0) {
            throw new Error(`Handler composition error: ${errors.map(e => e.error.message).join(', ')}`);
        }

        return results.map(result => result.value);
    };

    return Either.Right(composedHandler);
};

// Event filtering
export const createEventFilter = (predicate) => (handler) => {
    if (typeof predicate !== 'function') {
        return Either.Left('Predicate must be a function');
    }

    if (typeof handler !== 'function') {
        return Either.Left('Handler must be a function');
    }

    const filteredHandler = (event) => {
        const shouldHandle = Result.fromTry(() => predicate(event));
        
        if (shouldHandle.type === 'Error') {
            throw new Error(`Filter predicate error: ${shouldHandle.error.message}`);
        }

        if (shouldHandle.value) {
            return handler(event);
        }
    };

    return Either.Right(filteredHandler);
};

// Event transformation
export const createEventTransformer = (transformer) => (handler) => {
    if (typeof transformer !== 'function') {
        return Either.Left('Transformer must be a function');
    }

    if (typeof handler !== 'function') {
        return Either.Left('Handler must be a function');
    }

    const transformingHandler = (event) => {
        const transformedEventResult = Result.fromTry(() => transformer(event));
        
        if (transformedEventResult.type === 'Error') {
            throw new Error(`Event transformation error: ${transformedEventResult.error.message}`);
        }

        return handler(transformedEventResult.value);
    };

    return Either.Right(transformingHandler);
};

// Debounce event handler
export const debounce = (delay) => (handler) => {
    if (typeof delay !== 'number' || delay < 0) {
        return Either.Left('Delay must be a non-negative number');
    }

    if (typeof handler !== 'function') {
        return Either.Left('Handler must be a function');
    }

    let timeoutId = null;

    const debouncedHandler = (event) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
            handler(event);
        }, delay);
    };

    return Either.Right(debouncedHandler);
};

// Throttle event handler
export const throttle = (interval) => (handler) => {
    if (typeof interval !== 'number' || interval < 0) {
        return Either.Left('Interval must be a non-negative number');
    }

    if (typeof handler !== 'function') {
        return Either.Left('Handler must be a function');
    }

    let lastExecution = 0;

    const throttledHandler = (event) => {
        const now = Date.now();
        
        if (now - lastExecution >= interval) {
            lastExecution = now;
            handler(event);
        }
    };

    return Either.Right(throttledHandler);
};

// Event delegation helper
export const createDelegatedHandler = (selector, handler) => {
    if (typeof selector !== 'string') {
        return Either.Left('Selector must be a string');
    }

    if (typeof handler !== 'function') {
        return Either.Left('Handler must be a function');
    }

    const delegatedHandler = (event) => {
        // This would be used with DOM events
        if (event.target && event.target.matches && event.target.matches(selector)) {
            handler(event);
        }
    };

    return Either.Right(delegatedHandler);
};

// Event namespace utilities
export const createNamespacedEventBus = (namespace) => {
    if (typeof namespace !== 'string' || !namespace.trim()) {
        return Either.Left('Namespace must be a non-empty string');
    }

    const eventBusResult = createEventBus();
    
    if (eventBusResult.type === 'Left') {
        return eventBusResult;
    }

    const eventBus = eventBusResult.value;

    // Wrap methods to add namespace
    const namespacedBus = {
        on: (eventType, handler) => eventBus.on(`${namespace}:${eventType}`, handler),
        once: (eventType, handler) => eventBus.once(`${namespace}:${eventType}`, handler),
        emit: (eventType, data) => eventBus.emit(`${namespace}:${eventType}`, data),
        off: (eventType) => eventBus.off(`${namespace}:${eventType}`),
        use: eventBus.use,
        getStats: eventBus.getStats,
        namespace
    };

    return Either.Right(namespacedBus);
};

// Event pattern matching
export const createPatternMatcher = (patterns) => {
    if (!Array.isArray(patterns) || patterns.length === 0) {
        return Either.Left('Patterns must be a non-empty array');
    }

    const matcher = (eventType) => {
        for (const pattern of patterns) {
            if (typeof pattern === 'string') {
                if (eventType === pattern) {
                    return true;
                }
            } else if (pattern instanceof RegExp) {
                if (pattern.test(eventType)) {
                    return true;
                }
            } else if (typeof pattern === 'function') {
                const matchResult = Result.fromTry(() => pattern(eventType));
                if (matchResult.type === 'Ok' && matchResult.value) {
                    return true;
                }
            }
        }
        return false;
    };

    return Either.Right(matcher);
};

// Export event utilities
export const EventUtils = {
    createEventBus,
    composeEventHandlers,
    createEventFilter,
    createEventTransformer,
    debounce,
    throttle,
    createDelegatedHandler,
    createNamespacedEventBus,
    createPatternMatcher
};
