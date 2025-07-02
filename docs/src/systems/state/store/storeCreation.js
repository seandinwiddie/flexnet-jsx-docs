import { createReducer, loadPersistedState } from '../functions.js';
import { createAppStateSchema } from './schema.js';
import { ActionTypes } from './actions.js';
import { rootReducer } from './reducers.js';
import { createPersistenceMiddleware, createEffectMiddleware } from './middleware.js';

// ===========================================
// SIMPLIFIED STORE CREATION
// ===========================================

export const createAppStore = () => {
    const initialState = createAppStateSchema();
    
    // Try to load persisted state
    const persistedState = loadPersistedState('flexnet-app-state', {})
        .fold(
            () => ({}), // Ignore errors, use empty object
            state => state || {}
        );
    
    // Merge with initial state
    const mergedState = {
        ...initialState,
        ui: { ...initialState.ui, ...(persistedState.ui || {}) },
        navigation: { ...initialState.navigation, ...(persistedState.navigation || {}) }
    };
    
    // Create the store with simplified reducer mapping
    const store = createReducer(mergedState, {
        [ActionTypes.SET_THEME]: rootReducer,
        [ActionTypes.TOGGLE_SIDEBAR]: rootReducer,
        [ActionTypes.SET_ACTIVE_SECTION]: rootReducer,
        [ActionTypes.UPDATE_CURRENT_PATH]: rootReducer,
        [ActionTypes.SET_LOADING]: rootReducer,
        [ActionTypes.ADD_ERROR]: rootReducer
    });
    
    return store;
};

// ===========================================
// SIMPLIFIED MIDDLEWARE SETUP
// ===========================================

export const setupStoreMiddleware = (store) => {
    // Add basic middleware
    const persistenceMiddleware = createPersistenceMiddleware(store);
    const effectMiddleware = createEffectMiddleware(store);
    
    // Subscribe to state changes
    store.subscribe((newState, oldState) => {
        // Run middleware
        persistenceMiddleware();
        effectMiddleware({ type: 'STATE_CHANGE', payload: { newState, oldState } });
    });
    
    return store;
};
