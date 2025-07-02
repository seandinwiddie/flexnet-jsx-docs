// === FlexNet State Management System ===
// Pure functional state management with immutable transitions

import Maybe from '../../core/types/maybe.js';
import Either from '../../core/types/either.js';
import Result from '../../core/types/result.js';
import { compose, pipe } from '../../core/functions/composition.js';

// Create immutable state container - pure function
export const createState = (initialValue) => {
    // Validate initial value
    if (initialValue === null || initialValue === undefined) {
        return Either.Left('Initial state cannot be null or undefined');
    }

    // Create immutable state object
    const state = Object.freeze({
        value: initialValue,
        timestamp: Date.now(),
        version: 0
    });

    return Either.Right(state);
};

// State transition function - pure and immutable
export const transition = (transitionFn) => (currentState) => {
    if (!currentState || typeof currentState !== 'object') {
        return Either.Left('Invalid state object for transition');
    }

    // Apply transition function with error handling
    const transitionResult = Result.fromTry(() => transitionFn(currentState.value));
    
    if (transitionResult.type === 'Error') {
        return Either.Left(`State transition failed: ${transitionResult.error.message}`);
    }

    const newValue = transitionResult.value;

    // Create new immutable state
    const newState = Object.freeze({
        value: newValue,
        timestamp: Date.now(),
        version: currentState.version + 1,
        previous: currentState // Chain for history
    });

    return Either.Right(newState);
};

// State composition - combine multiple states
export const composeStates = (...states) => {
    if (states.length === 0) {
        return Either.Left('Cannot compose empty states');
    }

    const invalidState = states.find(state => 
        !state || typeof state !== 'object' || !('value' in state)
    );

    if (invalidState !== undefined) {
        return Either.Left('All states must be valid state objects');
    }

    const composedValue = states.reduce((acc, state) => ({
        ...acc,
        [`state_${state.version || 0}`]: state.value
    }), {});

    const composedState = Object.freeze({
        value: composedValue,
        timestamp: Date.now(),
        version: Math.max(...states.map(s => s.version || 0)) + 1,
        composed: true,
        sources: states.length
    });

    return Either.Right(composedState);
};

// State validation - ensure state integrity
export const validateState = (expectedSchema) => (state) => {
    if (!state || typeof state !== 'object') {
        return Either.Left('Invalid state object');
    }

    if (!('value' in state) || !('timestamp' in state) || !('version' in state)) {
        return Either.Left('State missing required properties');
    }

    // Schema validation if provided
    if (expectedSchema && typeof expectedSchema === 'function') {
        const schemaResult = Result.fromTry(() => expectedSchema(state.value));
        
        if (schemaResult.type === 'Error') {
            return Either.Left(`Schema validation failed: ${schemaResult.error.message}`);
        }

        if (!schemaResult.value) {
            return Either.Left('State value does not match expected schema');
        }
    }

    return Either.Right(state);
};

// State projection - extract specific parts of state
export const project = (projectionFn) => (state) => {
    if (!state || !('value' in state)) {
        return Either.Left('Invalid state for projection');
    }

    const projectionResult = Result.fromTry(() => projectionFn(state.value));
    
    if (projectionResult.type === 'Error') {
        return Either.Left(`Projection failed: ${projectionResult.error.message}`);
    }

    const projectedState = Object.freeze({
        value: projectionResult.value,
        timestamp: state.timestamp,
        version: state.version,
        projected: true,
        source: state
    });

    return Either.Right(projectedState);
};

// State history utilities
export const getStateHistory = (state, maxDepth = 10) => {
    const history = [];
    let current = state;
    let depth = 0;

    while (current && current.previous && depth < maxDepth) {
        history.push({
            value: current.value,
            timestamp: current.timestamp,
            version: current.version
        });
        current = current.previous;
        depth++;
    }

    return Either.Right(history);
};

// Rollback to previous state
export const rollback = (steps = 1) => (state) => {
    if (!state || steps < 1) {
        return Either.Left('Invalid rollback parameters');
    }

    let current = state;
    for (let i = 0; i < steps; i++) {
        if (!current.previous) {
            return Either.Left(`Cannot rollback ${steps} steps - insufficient history`);
        }
        current = current.previous;
    }

    // Create new state from rolled back value
    const rolledBackState = Object.freeze({
        value: current.value,
        timestamp: Date.now(),
        version: state.version + 1,
        rolledBack: true,
        rollbackSteps: steps,
        previous: state
    });

    return Either.Right(rolledBackState);
};

// State store creator with pure functional interface
export const createStore = (initialState, reducer) => {
    // Validate inputs
    if (!reducer || typeof reducer !== 'function') {
        return Either.Left('Reducer must be a function');
    }

    const initialStateResult = createState(initialState);
    if (initialStateResult.type === 'Left') {
        return initialStateResult;
    }

    let currentState = initialStateResult.value;
    const subscribers = [];

    // Pure store interface
    const store = {
        // Get current state - pure function
        getState: () => Either.Right(currentState),

        // Dispatch action - returns new state
        dispatch: (action) => {
            const newStateResult = transition(state => reducer(state, action))(currentState);
            
            if (newStateResult.type === 'Left') {
                return newStateResult;
            }

            currentState = newStateResult.value;

            // Notify subscribers (isolated side effect)
            subscribers.forEach(subscriber => {
                Result.fromTry(() => subscriber(currentState));
            });

            return Either.Right(currentState);
        },

        // Subscribe to state changes
        subscribe: (callback) => {
            if (typeof callback !== 'function') {
                return Either.Left('Callback must be a function');
            }

            subscribers.push(callback);

            // Return unsubscribe function
            const unsubscribe = () => {
                const index = subscribers.indexOf(callback);
                if (index > -1) {
                    subscribers.splice(index, 1);
                }
            };

            return Either.Right(unsubscribe);
        },

        // Get store metadata
        getMetadata: () => Either.Right({
            subscriberCount: subscribers.length,
            stateVersion: currentState.version,
            stateTimestamp: currentState.timestamp
        })
    };

    return Either.Right(store);
};

// State middleware for additional processing
export const applyMiddleware = (middleware) => (store) => {
    if (!store || typeof store.dispatch !== 'function') {
        return Either.Left('Invalid store for middleware');
    }

    if (!middleware || typeof middleware !== 'function') {
        return Either.Left('Middleware must be a function');
    }

    const originalDispatch = store.dispatch;

    const enhancedStore = {
        ...store,
        dispatch: (action) => {
            const middlewareResult = Result.fromTry(() => middleware(store)(originalDispatch)(action));
            
            if (middlewareResult.type === 'Error') {
                return Either.Left(`Middleware error: ${middlewareResult.error.message}`);
            }

            return Either.Right(middlewareResult.value);
        }
    };

    return Either.Right(enhancedStore);
};

// Combine multiple reducers
export const combineReducers = (reducers) => {
    if (!reducers || typeof reducers !== 'object') {
        return Either.Left('Reducers must be an object');
    }

    const reducerKeys = Object.keys(reducers);
    
    if (reducerKeys.length === 0) {
        return Either.Left('Cannot combine empty reducers');
    }

    const combinedReducer = (state, action) => {
        const nextState = {};

        for (const key of reducerKeys) {
            const reducer = reducers[key];
            const previousStateForKey = state ? state[key] : undefined;
            const nextStateForKey = reducer(previousStateForKey, action);
            nextState[key] = nextStateForKey;
        }

        return nextState;
    };

    return Either.Right(combinedReducer);
};

// Export state utilities
export const StateUtils = {
    createState,
    transition,
    composeStates,
    validateState,
    project,
    getStateHistory,
    rollback,
    createStore,
    applyMiddleware,
    combineReducers
};
