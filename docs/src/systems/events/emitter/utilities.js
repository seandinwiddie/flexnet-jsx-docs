import Either from '../../../core/types/either.js';

// === FlexNet Event Emitter Utilities ===
// Simplified utility functions

// ===========================================
// UTILITY FUNCTIONS
// ===========================================

export const createListenerCountFunction = (getState) => 
    (eventName) => {
        const state = getState();
        if (eventName) {
            return (state.listeners.get(eventName) || []).length;
        }
        // Total count
        let total = 0;
        for (const listeners of state.listeners.values()) {
            total += listeners.length;
        }
        return total;
    };

export const createEventNamesFunction = (getState) => 
    () => {
        const state = getState();
        return Array.from(state.listeners.keys());
    };

export const createHasListenersFunction = (listenerCountFunction) => 
    (eventName) => {
        return listenerCountFunction(eventName) > 0;
    };

export const createGetStatsFunction = (getState) => 
    () => {
        const state = getState();
        return {
            totalListeners: createListenerCountFunction(getState)(),
            eventCount: state.listeners.size,
            maxListeners: state.maxListeners,
            trackHistory: state.trackHistory
        };
    };

export const createGetEventHistoryFunction = (getState) => 
    () => {
        const state = getState();
        return state.eventHistory || [];
    };

export const createClearEventHistoryFunction = (getState, updateState) => 
    () => {
        updateState(state => ({
            ...state,
            eventHistory: []
        }));
    };

export const createDebugFunction = (getState, updateState) => 
    (enable = true) => {
        updateState(state => ({
            ...state,
            debug: enable
        }));
    };
