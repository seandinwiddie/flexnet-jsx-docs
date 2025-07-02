// === FlexNet State Store ===
// Simple functional state management matching documented API
// Individual functions in separate files, this is just the root import/export

// Core Store Functions
export { createStore } from './functions/createStore.js';
export { getState, dispatch, subscribe } from './functions/storeInstance.js';

// State Utilities
export { validateState } from './functions/validateState.js';

// Legacy compatibility - simple store interface matching documentation
const subscribers = new Set();
let currentState = {};

export const FlexNetStore = {
    getState: () => currentState,
    dispatch: (action) => {
        if (typeof action === 'function') {
            currentState = action(currentState);
        } else if (action && action.type) {
            // Simple action handling
            currentState = { ...currentState, ...action.payload };
        }
        subscribers.forEach(fn => fn(currentState));
    },
    subscribe: (fn) => {
        subscribers.add(fn);
        return () => subscribers.delete(fn);
    }
};
