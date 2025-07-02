// === FlexNet State Store Instance ===
// Simplified store instance management

import { createAppStore, setupStoreMiddleware } from './storeCreation.js';
import { stateValidationSchema } from './schema.js';

// ===========================================
// STORE INSTANCE
// ===========================================

let storeInstance = null;

// ===========================================
// STORE ACCESS FUNCTIONS
// ===========================================

export const getStore = () => {
    if (!storeInstance) {
        storeInstance = setupStoreMiddleware(createAppStore());
    }
    return storeInstance;
};

export const getState = () => {
    return getStore().getState();
};

export const dispatch = (action) => {
    return getStore().dispatch(action);
};

export const subscribe = (listener) => {
    return getStore().subscribe(listener);
};

// ===========================================
// VALIDATION FUNCTIONS
// ===========================================

export const validateAppState = (state) => {
    return stateValidationSchema(state || getState());
};

// ===========================================
// STORE UTILITIES
// ===========================================

export const resetStore = () => {
    storeInstance = null;
    return getStore();
};

export const isStoreInitialized = () => {
    return storeInstance !== null;
}; 