// === FlexNet State System ===
// Pure functional state management with immutable transitions

import Maybe from '../../core/types/maybe.js';
import Either from '../../core/types/either.js';
import Result from '../../core/types/result.js';
import { compose, pipe, curry } from '../../core/functions/composition.js';
import { ImmutableSet, deepFreeze } from '../../utils/immutable.js';

// Core state container with immutable updates
export const createState = (initialValue) => {
    let currentState = deepFreeze(initialValue);
    let subscribers = ImmutableSet.empty();
    
    return Object.freeze({
        // Get current state value
        get: () => currentState,
        
        // Update state with pure function
        update: (updaterFn) =>
            Result.fromTry(() => {
                if (typeof updaterFn !== 'function') {
                    throw new Error('Updater must be a function');
                }
                
                const newState = updaterFn(currentState);
                
                // Ensure immutability
                if (newState === currentState) {
                    return currentState; // No change
                }
                
                const frozenState = Object.freeze(newState);
                const previousState = currentState;
                currentState = frozenState;
                
                // Notify subscribers using immutable forEach
                subscribers.forEach(subscriber => {
                    Result.fromTry(() => subscriber(frozenState, previousState))
                        .mapLeft(error => console.error('State subscriber error:', error));
                });
                
                return frozenState;
            }),
        
        // Subscribe to state changes
        subscribe: (callback) => {
            if (typeof callback !== 'function') {
                return Either.Left('Callback must be a function');
            }
            
            subscribers = ImmutableSet.add(callback)(subscribers);
            
            // Return unsubscribe function
            return Either.Right(() => {
                subscribers = ImmutableSet.delete(callback)(subscribers);
                return true;
            });
        },
        
        // Get current subscriber count
        getSubscriberCount: () => ImmutableSet.size(subscribers),
        
        // Reset state to initial value
        reset: () => {
            const previousState = currentState;
            currentState = deepFreeze(initialValue);
            
            subscribers.forEach(subscriber => {
                Result.fromTry(() => subscriber(currentState, previousState))
                    .mapLeft(error => console.error('State subscriber error:', error));
            });
            
            return currentState;
        }
    });
};

// State reducer pattern for complex state management
export const createReducer = (initialState, reducerMap) => {
    const validateAction = (action) =>
        action && typeof action === 'object' && typeof action.type === 'string'
            ? Either.Right(action)
            : Either.Left('Action must have a type property');
    
    const reducer = (state, action) =>
        validateAction(action)
            .chain(validAction => {
                const actionHandler = reducerMap[validAction.type];
                
                if (!actionHandler || typeof actionHandler !== 'function') {
                    return Either.Left(`Unknown action type: ${validAction.type}`);
                }
                
                return Result.fromTry(() => actionHandler(state, validAction))
                    .chain(newState => 
                        newState !== null && newState !== undefined
                            ? Result.Ok(Object.freeze(newState))
                            : Result.Error('Reducer returned null or undefined')
                    )
                    .fold(
                        error => Either.Left(error),
                        newState => Either.Right(newState)
                    );
            })
            .getOrElse(state);
    
    const state = createState(initialState);
    
    return Object.freeze({
        // Get current state
        getState: state.get,
        
        // Dispatch action
        dispatch: (action) => {
            const currentState = state.get();
            const newState = reducer(currentState, action);
            
            if (newState !== currentState) {
                return state.update(() => newState);
            }
            
            return Result.Ok(currentState);
        },
        
        // Subscribe to state changes
        subscribe: state.subscribe,
        
        // Reset to initial state
        reset: state.reset
    });
};

// Composable state updates
export const updateProperty = curry((property, updater, state) =>
    Maybe.fromNullable(state)
        .map(s => ({
            ...s,
            [property]: typeof updater === 'function' 
                ? updater(s[property])
                : updater
        }))
        .getOrElse(state)
);

export const setProperty = curry((property, value, state) =>
    updateProperty(property, () => value, state)
);

export const deleteProperty = curry((property, state) => {
    if (!state || typeof state !== 'object') {
        return state;
    }
    
    const { [property]: deleted, ...rest } = state;
    return rest;
});

// Array state operations
export const appendToArray = curry((property, item, state) =>
    updateProperty(property, arr => 
        Array.isArray(arr) ? [...arr, item] : [item]
    , state)
);

export const prependToArray = curry((property, item, state) =>
    updateProperty(property, arr =>
        Array.isArray(arr) ? [item, ...arr] : [item]
    , state)
);

export const removeFromArray = curry((property, predicate, state) =>
    updateProperty(property, arr =>
        Array.isArray(arr) ? arr.filter(item => !predicate(item)) : []
    , state)
);

export const updateArrayItem = curry((property, predicate, updater, state) =>
    updateProperty(property, arr =>
        Array.isArray(arr) 
            ? arr.map(item => predicate(item) ? updater(item) : item)
            : []
    , state)
);

// Object state operations
export const mergeObject = curry((property, objectToMerge, state) =>
    updateProperty(property, obj =>
        obj && typeof obj === 'object'
            ? { ...obj, ...objectToMerge }
            : objectToMerge
    , state)
);

// Conditional state updates
export const updateWhen = curry((predicate, updater, state) =>
    predicate(state) ? updater(state) : state
);

export const updateUnless = curry((predicate, updater, state) =>
    updateWhen(state => !predicate(state), updater, state)
);

// State validation utilities
export const validateState = (schema, state) => {
    if (!schema || typeof schema !== 'object') {
        return Either.Left('Invalid schema');
    }
    
    if (!state || typeof state !== 'object') {
        return Either.Left('Invalid state');
    }
    
    try {
        const errors = [];
        
        Object.entries(schema).forEach(([key, validator]) => {
            if (typeof validator === 'function') {
                const result = validator(state[key]);
                if (result && result.type === 'Left') {
                    errors.push(`${key}: ${result.value}`);
                }
            }
        });
        
        return errors.length > 0
            ? Either.Left(errors.join(', '))
            : Either.Right(state);
    } catch (error) {
        return Either.Left(`Validation error: ${error.message}`);
    }
};

// State lens operations for deep updates
export const createLens = (getter, setter) => Object.freeze({
    get: getter,
    set: setter,
    over: curry((fn, state) => setter(fn(getter(state)), state))
});

export const propertyLens = (property) =>
    createLens(
        state => state && state[property],
        (value, state) => ({ ...state, [property]: value })
    );

export const pathLens = (path) => {
    const pathArray = Array.isArray(path) ? path : path.split('.');
    
    const getter = (state) =>
        pathArray.reduce((current, key) => 
            current && current[key], state
        );
    
    const setter = (value, state) => {
        if (pathArray.length === 0) return value;
        if (pathArray.length === 1) return { ...state, [pathArray[0]]: value };
        
        const [head, ...tail] = pathArray;
        const nested = state[head] || {};
        
        return {
            ...state,
            [head]: pathLens(tail).set(value, nested)
        };
    };
    
    return createLens(getter, setter);
};

// State composition utilities
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

// State persistence utilities
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

// State debugging utilities
export const logStateChanges = (stateName) => (newState, oldState) => {
    console.group(`State Change: ${stateName}`);
    console.log('Previous:', oldState);
    console.log('Current:', newState);
    console.groupEnd();
};

export const createStateLogger = (state, name) => {
    const logger = logStateChanges(name);
    return state.subscribe(logger);
};

// Export state management utilities
export const STATE_UTILS = Object.freeze({
    createState,
    createReducer,
    updateProperty,
    setProperty,
    deleteProperty,
    appendToArray,
    prependToArray,
    removeFromArray,
    updateArrayItem,
    mergeObject,
    updateWhen,
    updateUnless,
    validateState,
    createLens,
    propertyLens,
    pathLens,
    combineStates,
    persistState,
    loadPersistedState,
    createStateLogger
});
