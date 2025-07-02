import Maybe from '../../../core/types/maybe.js';
import Either from '../../../core/types/either.js';
import Result from '../../../core/types/result.js';
import { ImmutableSet, deepFreeze } from '../../../utils/immutable.js';

// ===========================================
// CORE STATE MANAGEMENT
// ===========================================

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
                    return Either.Left('Updater must be a function');
                }
                
                const newState = updaterFn(currentState);
                
                // Ensure immutability
                if (newState === currentState) {
                    return Either.Right(currentState); // No change
                }
                
                const frozenState = Object.freeze(newState);
                const previousState = currentState;
                currentState = frozenState;
                
                // Notify subscribers using immutable forEach
                ImmutableSet.toArray(subscribers).forEach(subscriber => {
                    Result.fromTry(() => subscriber(frozenState, previousState))
                        .mapLeft(error => console.error('State subscriber error:', error));
                });
                
                return Either.Right(frozenState);
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
            
            ImmutableSet.toArray(subscribers).forEach(subscriber => {
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