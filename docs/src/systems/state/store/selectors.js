// === FlexNet State Store Selectors ===
// Simplified selectors for docs website state

// ===========================================
// UI SELECTORS
// ===========================================

export const selectTheme = (state) => state.ui?.theme || 'light';

export const selectSidebarOpen = (state) => state.ui?.sidebarOpen || false;

export const selectActiveSection = (state) => state.ui?.activeSection || null;

// ===========================================
// NAVIGATION SELECTORS
// ===========================================

export const selectCurrentPath = (state) => state.navigation?.currentPath || '/';

// ===========================================
// APP SELECTORS
// ===========================================

export const selectIsLoading = (state) => state.app?.loading || false;

export const selectErrors = (state) => state.app?.errors || [];

export const selectIsInitialized = (state) => state.app?.initialized || false;

// ===========================================
// COMPUTED SELECTORS
// ===========================================

export const selectHasErrors = (state) => selectErrors(state).length > 0;

export const selectInitializationTime = (state) => state.app?.initializationTime || null;

// ===========================================
// SELECTOR UTILITIES
// ===========================================

export const createSelector = (selectorFn) => (state) => selectorFn(state);

export const combineSelectors = (selectors) => (state) => 
    Object.keys(selectors).reduce((result, key) => {
        result[key] = selectors[key](state);
        return result;
    }, {}); 