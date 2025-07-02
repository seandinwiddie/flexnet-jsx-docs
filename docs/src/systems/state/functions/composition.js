import Maybe from '../../../core/types/maybe.js';
import Result from '../../../core/types/result.js';
import { createState } from './coreState.js';

// ===========================================
// STATE COMPOSITION UTILITIES
// ===========================================

export const combineStates = (stateMap) => {
    const states = Object.entries(stateMap);
    const combinedState = createState(
        states.reduce((acc, [key, state]) => ({
            ...acc,
            [key]: state.get()
        }), {})
    );
    
    // Subscribe to all individual states
    states.forEach(([key, state]) => {
        state.subscribe((newValue, oldValue) => {
            combinedState.update(current => ({
                ...current,
                [key]: newValue
            }));
        });
    });
    
    return Object.freeze({
        get: combinedState.get,
        subscribe: combinedState.subscribe,
        getState: (key) => 
            Maybe.fromNullable(stateMap[key])
                .map(state => state.get()),
        updateState: (key, updater) =>
            Maybe.fromNullable(stateMap[key])
                .map(state => state.update(updater))
                .getOrElse(Result.Error(`State '${key}' not found`))
    });
}; 