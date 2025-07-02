import { curry } from '../../../core/functions/composition.js';

// ===========================================
// EMISSION FUNCTIONS
// ===========================================

export const matchesPattern = (pattern, eventName) => {
    if (pattern === '*') return true;
    if (pattern.includes('*')) {
        const regex = new RegExp(pattern.replace(/\*/g, '.*'));
        return regex.test(eventName);
    }
    return pattern === eventName;
};

export const createGetListenersForEventFunction = (getState) => 
    (eventName) => {
        const state = getState();
        const listeners = state.listeners.get(eventName) || [];
        const wildcardListeners = state.wildcardListeners.filter(
            listener => matchesPattern(listener.pattern, eventName)
        );
        
        return [...listeners, ...wildcardListeners];
    };

export const createEmitFunction = (getState, updateState, offFunction) => 
    curry((eventName, ...args) => {
        const listeners = createGetListenersForEventFunction(getState)(eventName);
        
        // Track event in history if enabled
        const state = getState();
        if (state.trackHistory) {
            updateState(currentState => ({
                ...currentState,
                eventHistory: [
                    ...(currentState.eventHistory || []),
                    { eventName, args, timestamp: Date.now() }
                ].slice(-100) // Keep last 100 events
            }));
        }
        
        // Execute listeners
        listeners.forEach(listener => {
            try {
                listener(...args);
            } catch (error) {
                console.error(`Error in event listener for "${eventName}":`, error);
            }
        });
        
        return listeners.length;
    });
