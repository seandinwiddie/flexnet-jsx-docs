// === FlexNet Central State Store ===
// Immutable state management with effect coordination
// Simplified functional interface following FlexNet architecture

import { createAppStateSchema, stateValidationSchema } from './store/schema.js';
import { 
    ActionTypes,
    setTheme,
    toggleSidebar,
    setActiveSection,
    toggleSection,
    setMobileMenu,
    updateCurrentPath,
    setLoading,
    logoLoaded,
    themeSwitcherInit,
    sidebarInit,
    addError,
    addWarning
} from './store/actions.js';
import { rootReducer } from './store/reducers.js';
import {
    selectTheme,
    selectSidebarOpen,
    selectActiveSection,
    selectCurrentPath,
    selectIsInitialized,
    selectErrors,
    selectIsLoading,
    selectHasErrors,
    selectInitializationTime
} from './store/selectors.js';
import { createEffectMiddleware, createPersistenceMiddleware } from './store/middleware.js';
import { createAppStore, setupStoreMiddleware } from './store/storeCreation.js';
import { 
    getStore, 
    dispatch, 
    getState, 
    subscribe, 
    validateAppState 
} from './store/storeInstance.js';
import { validateState } from './functions.js';

// ===========================================
// CORE STORE API - PURE FUNCTIONAL INTERFACE
// ===========================================

/**
 * Core store operations following functional programming principles
 * All operations return immutable results and use pure functions
 */
export const StoreAPI = Object.freeze({
    // State access (pure functions)
    getState: () => getState(),
    
    // State selectors (pure functions)
    select: Object.freeze({
        theme: () => selectTheme(getState()),
        sidebarOpen: () => selectSidebarOpen(getState()),
        activeSection: () => selectActiveSection(getState()),
        currentPath: () => selectCurrentPath(getState()),
        isInitialized: () => selectIsInitialized(getState()),
        errors: () => selectErrors(getState()),
        isLoading: () => selectIsLoading(getState()),
        hasErrors: () => selectHasErrors(getState()),
        initializationTime: () => selectInitializationTime(getState())
    }),
    
    // State validation (pure function)
    validate: (state) => validateAppState(state || getState()),
    
    // Subscription management
    subscribe: (listener) => subscribe(listener),
    
    // Store instance access (for advanced use cases)
    getStore: () => getStore()
});

/**
 * Action creators for state mutations
 * All actions follow the pure function pattern
 */
export const Actions = Object.freeze({
    // Theme actions
    setTheme: (theme) => dispatch(setTheme(theme)),
    
    // UI actions
    toggleSidebar: () => dispatch(toggleSidebar()),
    setActiveSection: (section) => dispatch(setActiveSection(section)),
    toggleSection: (section) => dispatch(toggleSection(section)),
    setMobileMenu: (isOpen) => dispatch(setMobileMenu(isOpen)),
    
    // Navigation actions
    updateCurrentPath: (path) => dispatch(updateCurrentPath(path)),
    
    // Loading actions
    setLoading: (isLoading) => dispatch(setLoading(isLoading)),
    
    // Component lifecycle actions
    logoLoaded: () => dispatch(logoLoaded()),
    themeSwitcherInit: () => dispatch(themeSwitcherInit()),
    sidebarInit: () => dispatch(sidebarInit()),
    
    // Error handling actions
    addError: (error) => dispatch(addError(error)),
    addWarning: (warning) => dispatch(addWarning(warning))
});

/**
 * Functional state utilities for common operations
 */
export const StateUtils = Object.freeze({
    // State transformation utilities
    createInitialState: () => createAppStateSchema(),
    validateSchema: (state) => stateValidationSchema(state),
    
    // Pure state operations
    getCurrentTheme: () => StoreAPI.select.theme(),
    isSidebarOpen: () => StoreAPI.select.sidebarOpen(),
    getCurrentSection: () => StoreAPI.select.activeSection(),
    getCurrentPath: () => StoreAPI.select.currentPath(),
    getSystemStatus: () => ({
        initialized: StoreAPI.select.isInitialized(),
        loading: StoreAPI.select.isLoading(),
        hasErrors: StoreAPI.select.hasErrors(),
        initTime: StoreAPI.select.initializationTime()
    }),
    
    // State predicates (pure functions)
    isDarkTheme: () => StoreAPI.select.theme() === 'dark',
    isLightTheme: () => StoreAPI.select.theme() === 'light',
    isMobileMenuOpen: () => StoreAPI.select.sidebarOpen(),
    hasInitialized: () => StoreAPI.select.isInitialized(),
    isSystemLoading: () => StoreAPI.select.isLoading()
});

// ===========================================
// LEGACY COMPATIBILITY EXPORTS
// ===========================================

// Export essential types for external use
export { ActionTypes };

// Export core functions for backward compatibility
export {
    getStore,
    dispatch,
    getState,
    subscribe,
    validateAppState
};

// Export action creators for direct use (discouraged, use Actions object instead)
export {
    setTheme,
    toggleSidebar,
    setActiveSection,
    toggleSection,
    setMobileMenu,
    updateCurrentPath,
    setLoading,
    logoLoaded,
    themeSwitcherInit,
    sidebarInit,
    addError,
    addWarning
};

// Export selectors for direct use (discouraged, use StoreAPI.select instead)
export {
    selectTheme,
    selectSidebarOpen,
    selectActiveSection,
    selectCurrentPath,
    selectIsInitialized,
    selectErrors,
    selectIsLoading,
    selectHasErrors,
    selectInitializationTime
};

// ===========================================
// MAIN EXPORT - RECOMMENDED INTERFACE
// ===========================================

/**
 * Main FlexNet Store interface
 * Use this for all new code to ensure functional programming compliance
 */
export const FlexNetStore = Object.freeze({
    // Core API
    ...StoreAPI,
    
    // Action dispatchers
    actions: Actions,
    
    // Utility functions
    utils: StateUtils,
    
    // Type definitions
    types: { ActionTypes }
});

// Default export for ES6 module compatibility
export default FlexNetStore;
