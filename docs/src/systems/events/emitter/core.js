import { createEmitterState } from './state.js';
import { 
    createOnFunction, 
    createOnceFunction, 
    createOffFunction, 
    createRemoveAllListenersFunction 
} from './listeners.js';
import { createEmitFunction } from './emission.js';
import {
    createListenerCountFunction,
    createEventNamesFunction,
    createHasListenersFunction,
    createGetStatsFunction,
    createGetEventHistoryFunction,
    createClearEventHistoryFunction,
    createDebugFunction
} from './utilities.js';

// ===========================================
// SIMPLIFIED EVENT EMITTER IMPLEMENTATION
// ===========================================

export const createEventEmitter = (options = {}) => {
    let state = createEmitterState(options);
    
    // Internal state updater
    const updateState = (updater) => {
        state = Object.freeze(updater(state));
        return state;
    };
    
    // Get current state (read-only)
    const getState = () => state;
    
    // Create core functions
    const onFunction = createOnFunction(getState, updateState);
    const offFunction = createOffFunction(getState, updateState);
    const onceFunction = createOnceFunction(onFunction);
    const removeAllListenersFunction = createRemoveAllListenersFunction(getState, updateState);
    const emitFunction = createEmitFunction(getState, updateState, offFunction);
    
    // Create utility functions
    const listenerCountFunction = createListenerCountFunction(getState);
    const eventNamesFunction = createEventNamesFunction(getState);
    const hasListenersFunction = createHasListenersFunction(listenerCountFunction);
    const getStatsFunction = createGetStatsFunction(getState);
    const getEventHistoryFunction = createGetEventHistoryFunction(getState);
    const clearEventHistoryFunction = createClearEventHistoryFunction(getState, updateState);
    const debugFunction = createDebugFunction(getState, updateState);
    
    // ===========================================
    // PUBLIC API
    // ===========================================
    
    return Object.freeze({
        // Core methods
        on: onFunction,
        once: onceFunction,
        off: offFunction,
        emit: emitFunction,
        removeAllListeners: removeAllListenersFunction,
        
        // Utility methods
        listenerCount: listenerCountFunction,
        eventNames: eventNamesFunction,
        hasListeners: hasListenersFunction,
        getStats: getStatsFunction,
        
        // History methods (if enabled)
        getEventHistory: getEventHistoryFunction,
        clearEventHistory: clearEventHistoryFunction,
        
        // Debugging
        debug: debugFunction
    });
};
