// === FlexNet State Store ===
// Pure functional state management following FlexNet documentation standards
// Truly immutable state with no mutations or side effects

import Either from '../../core/types/either.js';
import Maybe from '../../core/types/maybe.js';
import Result from '../../core/types/result.js';
import { pipe, compose } from '../../core/functions/composition.js';

// Core Store Functions
export { createStore } from './functions/createStore.js';
export { getState, dispatch, subscribe } from './functions/storeInstance.js';

// State Utilities
export { validateState } from './functions/validateState.js';

/**
 * Create a truly immutable store following functional principles
 * @param {*} initialState - Initial state value
 * @param {Function} reducer - Pure reducer function
 * @returns {Object} Immutable store interface
 */
export const createImmutableStore = (initialState = {}, reducer = (state) => state) => {
    // Validate inputs
    const validateReducer = (fn) =>
        typeof fn === 'function'
            ? Either.Right(fn)
            : Either.Left('Reducer must be a function');

    const validateInitialState = (state) =>
        Either.Right(Object.freeze(structuredClone(state)));

    // Create store with validated inputs
    return Either.chain(validReducer =>
        Either.map(validState => {
            // Private state - never exposed directly
            let currentState = validState;
            const subscribers = Object.freeze([]);

            // Pure store interface
            const store = Object.freeze({
                // Get current state (always returns frozen copy)
                getState: () => Object.freeze(structuredClone(currentState)),
                
                // Dispatch action through pure reducer
                dispatch: (action) => {
                    const validateAction = (act) =>
                        act !== null && act !== undefined
                            ? Either.Right(act)
                            : Either.Left('Action cannot be null or undefined');

                    return pipe(
                        validateAction,
                        Either.chain(validAction => {
                            try {
                                const newState = validReducer(currentState, validAction);
                                const frozenNewState = Object.freeze(structuredClone(newState));
                                
                                // Create new store with new state (immutable update)
                                return Either.Right(createImmutableStore(frozenNewState, validReducer));
                            } catch (error) {
                                return Either.Left(`Reducer error: ${error.message}`);
                            }
                        })
                    )(action);
                },
                
                // Subscribe to state changes (pure function)
                subscribe: (listener) => {
                    const validateListener = (fn) =>
                        typeof fn === 'function'
                            ? Either.Right(fn)
                            : Either.Left('Listener must be a function');

                    return Either.map(validListener => {
                        const newSubscribers = Object.freeze([...subscribers, validListener]);
                        // Return new store with additional subscriber
                        return createStoreWithSubscribers(currentState, validReducer, newSubscribers);
                    })(validateListener(listener));
                },
                
                // Map over state (functional transformation)
                mapState: (fn) => {
                    const validateMapper = (mapper) =>
                        typeof mapper === 'function'
                            ? Either.Right(mapper)
                            : Either.Left('State mapper must be a function');

                    return Either.chain(validMapper => {
                        try {
                            const newState = validMapper(currentState);
                            const frozenNewState = Object.freeze(structuredClone(newState));
                            return Either.Right(createImmutableStore(frozenNewState, validReducer));
                        } catch (error) {
                            return Either.Left(`State mapping error: ${error.message}`);
                        }
                    })(validateMapper(fn));
                },
                
                // Chain state transformations
                chainState: (fn) => {
                    const validateChainer = (chainer) =>
                        typeof chainer === 'function'
                            ? Either.Right(chainer)
                            : Either.Left('State chainer must be a function');

                    return Either.chain(validChainer => {
                        try {
                            const result = validChainer(currentState);
                            return result && typeof result.getState === 'function'
                                ? Either.Right(result)
                                : Either.Left('Chainer must return a store');
                        } catch (error) {
                            return Either.Left(`State chaining error: ${error.message}`);
                        }
                    })(validateChainer(fn));
                },
                
                // Fold over state (safe extraction)
                foldState: (leftFn, rightFn) => {
                    try {
                        return rightFn(currentState);
                    } catch (error) {
                        return leftFn(error.message);
                    }
                },

                // Type identifier
                _isFlexNetStore: true
            });

            return store;
        })(validateInitialState(initialState))
    )(validateReducer(reducer));
};

/**
 * Helper to create store with subscribers
 * @param {*} state - Current state
 * @param {Function} reducer - Reducer function
 * @param {Array} subscribers - Subscriber functions
 * @returns {Object} Store with subscribers
 */
const createStoreWithSubscribers = (state, reducer, subscribers) => {
    const baseStore = createImmutableStore(state, reducer);
    
    return Either.fold(
        error => ({ error }),
        store => ({
            ...store,
            // Notify subscribers on dispatch
            dispatch: (action) => {
                const dispatchResult = store.dispatch(action);
                return Either.fold(
                    error => Either.Left(error),
                    newStore => {
                        // Notify all subscribers with new state
                        const newState = newStore.getState();
                        subscribers.forEach(subscriber => {
                            try {
                                subscriber(newState);
                            } catch (error) {
                                console.warn('Subscriber error:', error.message);
                            }
                        });
                        return Either.Right(newStore);
                    }
                )(dispatchResult);
            }
        })
    )(baseStore);
};

/**
 * Legacy compatibility store (deprecated - use createImmutableStore)
 * Maintained for backward compatibility but should be migrated
 */
export const FlexNetStore = (() => {
    console.warn('FlexNetStore is deprecated. Use createImmutableStore for strict functional compliance.');
    
    const deprecatedStore = createImmutableStore({}, (state, action) => {
        if (typeof action === 'function') {
            return action(state);
        }
        if (action && action.type && action.payload) {
            return { ...state, ...action.payload };
        }
        return state;
    });

    return Either.fold(
        error => {
            console.error('Failed to create legacy store:', error);
            return {
                getState: () => ({}),
                dispatch: () => Either.Left('Store creation failed'),
                subscribe: () => Either.Left('Store creation failed')
            };
        },
        store => ({
            getState: store.getState,
            dispatch: (action) => {
                const result = store.dispatch(action);
                return Either.fold(
                    error => { console.error('Dispatch failed:', error); },
                    newStore => newStore
                )(result);
            },
            subscribe: (listener) => {
                const result = store.subscribe(listener);
                return Either.fold(
                    error => { 
                        console.error('Subscribe failed:', error);
                        return () => {};
                    },
                    newStore => () => newStore
                )(result);
            }
        })
    )(deprecatedStore);
})();

/**
 * Pure function to combine multiple stores
 * @param {...Object} stores - Stores to combine
 * @returns {Either} Either containing combined store or error
 */
export const combineStores = (...stores) => {
    const validateStores = (storeArray) => {
        const invalidStores = storeArray.filter(store => !store || !store._isFlexNetStore);
        return invalidStores.length > 0
            ? Either.Left('All arguments must be valid FlexNet stores')
            : Either.Right(storeArray);
    };

    return Either.chain(validStores => {
        const combinedState = validStores.reduce((acc, store) => ({
            ...acc,
            ...store.getState()
        }), {});

        const combinedReducer = (state, action) => {
            return validStores.reduce((newState, store) => {
                const storeResult = store.dispatch(action);
                return Either.fold(
                    () => newState,
                    updatedStore => ({ ...newState, ...updatedStore.getState() })
                )(storeResult);
            }, state);
        };

        return createImmutableStore(combinedState, combinedReducer);
    })(validateStores(stores));
};
