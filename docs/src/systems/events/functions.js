// === FlexNet Event System ===
// Pure functional event handling and composition

import Maybe from '../../core/types/maybe.js';
import Either from '../../core/types/either.js';
import Result from '../../core/types/result.js';
import { compose, pipe, curry } from '../../core/functions/composition.js';

// Core event emitter with functional composition
export const createEventEmitter = () => {
    const listeners = new Map();
    
    return Object.freeze({
        // Subscribe to events
        on: curry((event, handler) => {
            if (typeof handler !== 'function') {
                return Either.Left('Handler must be a function');
            }
            
            const eventListeners = listeners.get(event) || new Set();
            eventListeners.add(handler);
            listeners.set(event, eventListeners);
            
            // Return unsubscribe function
            return Either.Right(() => {
                const currentListeners = listeners.get(event);
                if (currentListeners) {
                    currentListeners.delete(handler);
                    if (currentListeners.size === 0) {
                        listeners.delete(event);
                    }
                }
                return true;
            });
        }),
        
        // Subscribe once (auto-unsubscribe after first event)
        once: curry((event, handler) => {
            if (typeof handler !== 'function') {
                return Either.Left('Handler must be a function');
            }
            
            const wrappedHandler = (...args) => {
                handler(...args);
                // Auto-unsubscribe
                const currentListeners = listeners.get(event);
                if (currentListeners) {
                    currentListeners.delete(wrappedHandler);
                    if (currentListeners.size === 0) {
                        listeners.delete(event);
                    }
                }
            };
            
            const eventListeners = listeners.get(event) || new Set();
            eventListeners.add(wrappedHandler);
            listeners.set(event, eventListeners);
            
            return Either.Right(() => {
                const currentListeners = listeners.get(event);
                if (currentListeners) {
                    currentListeners.delete(wrappedHandler);
                    if (currentListeners.size === 0) {
                        listeners.delete(event);
                    }
                }
                return true;
            });
        }),
        
        // Emit events to all listeners
        emit: curry((event, ...args) =>
            Result.fromTry(() => {
                const eventListeners = listeners.get(event);
                
                if (!eventListeners || eventListeners.size === 0) {
                    return { event, listenerCount: 0, errors: [] };
                }
                
                const errors = [];
                let successCount = 0;
                
                eventListeners.forEach(handler => {
                    try {
                        handler(...args);
                        successCount++;
                    } catch (error) {
                        errors.push({
                            handler: handler.name || 'anonymous',
                            error: error.message
                        });
                    }
                });
                
                return {
                    event,
                    listenerCount: eventListeners.size,
                    successCount,
                    errors
                };
            })
        ),
        
        // Remove all listeners for an event
        off: (event) => {
            const hadListeners = listeners.has(event);
            listeners.delete(event);
            return hadListeners;
        },
        
        // Remove all listeners
        removeAllListeners: () => {
            const eventCount = listeners.size;
            listeners.clear();
            return eventCount;
        },
        
        // Get listener count for event
        listenerCount: (event) => {
            const eventListeners = listeners.get(event);
            return eventListeners ? eventListeners.size : 0;
        },
        
        // Get all registered events
        events: () => Array.from(listeners.keys())
    });
};

// DOM event handling utilities
export const addDOMListener = curry((element, event, handler, options = {}) =>
    Result.fromTry(() => {
        if (!element || !element.addEventListener) {
            throw new Error('Invalid element');
        }
        
        if (typeof handler !== 'function') {
            throw new Error('Handler must be a function');
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
            throw new Error('Invalid element');
        }
        
        element.removeEventListener(event, handler, options);
        return true;
    })
);

// Event delegation utilities
export const delegateEvent = curry((container, selector, event, handler) =>
    Result.fromTry(() => {
        if (!container || !container.addEventListener) {
            throw new Error('Invalid container element');
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

// Event composition utilities
export const composeEventHandlers = (...handlers) =>
    (event) => {
        const results = [];
        
        for (const handler of handlers) {
            if (typeof handler === 'function') {
                try {
                    const result = handler(event);
                    results.push({ success: true, result });
                } catch (error) {
                    results.push({ success: false, error });
                }
            }
        }
        
        return results;
    };

export const pipeEventHandlers = (...handlers) =>
    (event) => {
        let currentEvent = event;
        const results = [];
        
        for (const handler of handlers) {
            if (typeof handler === 'function') {
                try {
                    const result = handler(currentEvent);
                    results.push({ success: true, result });
                    
                    // If handler returns an event-like object, use it for next handler
                    if (result && typeof result === 'object' && result.type) {
                        currentEvent = result;
                    }
                } catch (error) {
                    results.push({ success: false, error });
                    break; // Stop pipe on error
                }
            }
        }
        
        return results;
    };

// Event filtering and transformation
export const filterEvents = curry((predicate, handler) =>
    (event) => {
        if (predicate(event)) {
            return handler(event);
        }
        return null;
    }
);

export const transformEvent = curry((transformer, handler) =>
    (event) => {
        try {
            const transformedEvent = transformer(event);
            return handler(transformedEvent);
        } catch (error) {
            console.error('Event transformation error:', error);
            return handler(event); // Fallback to original event
        }
    }
);

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

// Event prevention utilities
export const preventDefault = (handler) =>
    (event) => {
        event.preventDefault();
        return handler(event);
    };

export const stopPropagation = (handler) =>
    (event) => {
        event.stopPropagation();
        return handler(event);
    };

export const stopImmediatePropagation = (handler) =>
    (event) => {
        event.stopImmediatePropagation();
        return handler(event);
    };

// Event validation utilities
export const validateEvent = curry((schema, handler) =>
    (event) => {
        const validation = validateEventStructure(schema, event);
        
        if (validation.type === 'Right') {
            return handler(event);
        } else {
            console.warn('Event validation failed:', validation.value);
            return null;
        }
    }
);

const validateEventStructure = (schema, event) => {
    if (!schema || typeof schema !== 'object') {
        return Either.Left('Invalid schema');
    }
    
    if (!event || typeof event !== 'object') {
        return Either.Left('Invalid event');
    }
    
    try {
        const errors = [];
        
        Object.entries(schema).forEach(([property, validator]) => {
            if (typeof validator === 'function') {
                const result = validator(event[property]);
                if (result && result.type === 'Left') {
                    errors.push(`${property}: ${result.value}`);
                }
            }
        });
        
        return errors.length > 0
            ? Either.Left(errors.join(', '))
            : Either.Right(event);
    } catch (error) {
        return Either.Left(`Validation error: ${error.message}`);
    }
};

// Custom event creation
export const createCustomEvent = (type, detail = {}, options = {}) =>
    Result.fromTry(() => {
        const event = new CustomEvent(type, {
            detail: Object.freeze(detail),
            bubbles: options.bubbles || false,
            cancelable: options.cancelable || false,
            composed: options.composed || false
        });
        
        return event;
    });

export const dispatchCustomEvent = curry((element, event) =>
    Result.fromTry(() => {
        if (!element || !element.dispatchEvent) {
            throw new Error('Invalid element');
        }
        
        return element.dispatchEvent(event);
    })
);

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

// Keyboard event utilities
export const createKeyboardHandler = (keyMap) =>
    (event) => {
        const key = event.key || event.code;
        const modifiers = {
            ctrl: event.ctrlKey,
            alt: event.altKey,
            shift: event.shiftKey,
            meta: event.metaKey
        };
        
        const keyConfig = keyMap[key];
        if (!keyConfig) return null;
        
        // Check if modifiers match
        const modifierMatch = Object.entries(modifiers).every(([mod, pressed]) => {
            const required = keyConfig.modifiers && keyConfig.modifiers[mod];
            return required === undefined || required === pressed;
        });
        
        if (modifierMatch && typeof keyConfig.handler === 'function') {
            return keyConfig.handler(event);
        }
        
        return null;
    };

// Mouse event utilities
export const getMousePosition = (event) =>
    Maybe.fromNullable(event)
        .map(e => ({
            x: e.clientX,
            y: e.clientY,
            pageX: e.pageX,
            pageY: e.pageY,
            screenX: e.screenX,
            screenY: e.screenY
        }));

export const isInsideElement = curry((element, event) =>
    Maybe.fromNullable(element)
        .chain(() => getMousePosition(event))
        .map(pos => {
            const rect = element.getBoundingClientRect();
            return pos.x >= rect.left &&
                   pos.x <= rect.right &&
                   pos.y >= rect.top &&
                   pos.y <= rect.bottom;
        })
        .getOrElse(false)
);

// Event cleanup utilities
export const createEventCleanup = () => {
    const cleanupFunctions = new Set();
    
    return Object.freeze({
        add: (cleanupFn) => {
            if (typeof cleanupFn === 'function') {
                cleanupFunctions.add(cleanupFn);
                return true;
            }
            return false;
        },
        
        remove: (cleanupFn) => {
            return cleanupFunctions.delete(cleanupFn);
        },
        
        cleanup: () => {
            const errors = [];
            
            cleanupFunctions.forEach(fn => {
                try {
                    fn();
                } catch (error) {
                    errors.push(error);
                }
            });
            
            cleanupFunctions.clear();
            
            return errors.length > 0
                ? Result.Error(errors)
                : Result.Ok(true);
        },
        
        size: () => cleanupFunctions.size
    });
};

// Export event system utilities
export const EVENT_UTILS = Object.freeze({
    createEventEmitter,
    addDOMListener,
    removeDOMListener,
    delegateEvent,
    composeEventHandlers,
    pipeEventHandlers,
    filterEvents,
    transformEvent,
    debounceEvent,
    throttleEvent,
    preventDefault,
    stopPropagation,
    stopImmediatePropagation,
    validateEvent,
    createCustomEvent,
    dispatchCustomEvent,
    createEventBus,
    createKeyboardHandler,
    getMousePosition,
    isInsideElement,
    createEventCleanup
});
