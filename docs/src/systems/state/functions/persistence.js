import Result from '../../../core/types/result.js';

// ===========================================
// STATE PERSISTENCE UTILITIES
// ===========================================

export const persistState = (key, state, storage = localStorage) =>
    Result.fromTry(() => {
        const serialized = JSON.stringify(state.get());
        storage.setItem(key, serialized);
        
        // Subscribe to future changes
        return state.subscribe((newState) => {
            try {
                const serialized = JSON.stringify(newState);
                storage.setItem(key, serialized);
            } catch (error) {
                console.error('Failed to persist state:', error);
            }
        });
    });

export const loadPersistedState = (key, fallback = null, storage = localStorage) =>
    Result.fromTry(() => {
        const stored = storage.getItem(key);
        return stored ? JSON.parse(stored) : fallback;
    }); 