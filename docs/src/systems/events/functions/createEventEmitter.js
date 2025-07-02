import Maybe from '../../../core/types/maybe.js';
import Either from '../../../core/types/either.js';
import Result from '../../../core/types/result.js';
import { curry } from '../../../core/functions/composition.js';
import { ImmutableMap, ImmutableSet } from '../../../utils/immutable.js';

// Core event emitter with functional composition
export const createEventEmitter = () => {
    let listeners = ImmutableMap.empty();
    
    return Object.freeze({
        // Subscribe to events
        on: curry((event, handler) => {
            if (typeof handler !== 'function') {
                return Either.Left('Handler must be a function');
            }
            
            const currentListeners = ImmutableMap.get(event)(listeners)
                .getOrElse(ImmutableSet.empty());
            const updatedListeners = ImmutableSet.add(handler)(currentListeners);
            listeners = ImmutableMap.set(event, updatedListeners)(listeners);
            
            // Return unsubscribe function
            return Either.Right(() => {
                const eventListeners = ImmutableMap.get(event)(listeners);
                if (eventListeners.type === 'Just') {
                    const updated = ImmutableSet.delete(handler)(eventListeners.value);
                    if (ImmutableSet.size(updated) === 0) {
                        listeners = ImmutableMap.delete(event)(listeners);
                    } else {
                        listeners = ImmutableMap.set(event, updated)(listeners);
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
                const eventListeners = ImmutableMap.get(event)(listeners);
                if (eventListeners.type === 'Just') {
                    const updated = ImmutableSet.delete(wrappedHandler)(eventListeners.value);
                    if (ImmutableSet.size(updated) === 0) {
                        listeners = ImmutableMap.delete(event)(listeners);
                    } else {
                        listeners = ImmutableMap.set(event, updated)(listeners);
                    }
                }
            };
            
            const currentListeners = ImmutableMap.get(event)(listeners)
                .getOrElse(ImmutableSet.empty());
            const updatedListeners = ImmutableSet.add(wrappedHandler)(currentListeners);
            listeners = ImmutableMap.set(event, updatedListeners)(listeners);
            
            return Either.Right(() => {
                const eventListeners = ImmutableMap.get(event)(listeners);
                if (eventListeners.type === 'Just') {
                    const updated = ImmutableSet.delete(wrappedHandler)(eventListeners.value);
                    if (ImmutableSet.size(updated) === 0) {
                        listeners = ImmutableMap.delete(event)(listeners);
                    } else {
                        listeners = ImmutableMap.set(event, updated)(listeners);
                    }
                }
                return true;
            });
        }),
        
        // Emit events to all listeners
        emit: curry((event, ...args) =>
            Result.fromTry(() => {
                const eventListeners = ImmutableMap.get(event)(listeners);
                
                if (eventListeners.type === 'Nothing') {
                    return { event, listenerCount: 0, errors: [] };
                }
                
                const listenerSet = eventListeners.value;
                const listenerCount = ImmutableSet.size(listenerSet);
                
                if (listenerCount === 0) {
                    return { event, listenerCount: 0, errors: [] };
                }
                
                const errors = [];
                let successCount = 0;
                
                listenerSet.forEach(handler => {
                    Result.fromTry(() => handler(...args))
                        .fold(
                            error => errors.push({
                                handler: handler.name || 'anonymous',
                                error: error.message
                            }),
                            () => { successCount++; }
                        );
                });
                
                return {
                    event,
                    listenerCount,
                    successCount,
                    errors
                };
            })
        ),
        
        // Remove all listeners for an event
        off: (event) => {
            const hadListeners = ImmutableMap.has(event)(listeners);
            listeners = ImmutableMap.delete(event)(listeners);
            return hadListeners;
        },
        
        // Remove all listeners
        removeAllListeners: () => {
            const eventCount = ImmutableMap.size(listeners);
            listeners = ImmutableMap.empty();
            return eventCount;
        },
        
        // Get listener count for event
        listenerCount: (event) => {
            const eventListeners = ImmutableMap.get(event)(listeners);
            return eventListeners.type === 'Just' 
                ? ImmutableSet.size(eventListeners.value) 
                : 0;
        },
        
        // Get all registered events
        events: () => ImmutableMap.keys(listeners)
    });
}; 