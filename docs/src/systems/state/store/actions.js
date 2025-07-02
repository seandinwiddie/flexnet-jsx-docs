// === FlexNet State Store Actions ===
// Simplified action creators for docs website

// Action Types
export const ActionTypes = Object.freeze({
    SET_THEME: 'SET_THEME',
    TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
    SET_ACTIVE_SECTION: 'SET_ACTIVE_SECTION',
    UPDATE_CURRENT_PATH: 'UPDATE_CURRENT_PATH',
    SET_LOADING: 'SET_LOADING',
    ADD_ERROR: 'ADD_ERROR'
});

// ===========================================
// ACTION CREATORS
// ===========================================

// Theme Actions
export const setTheme = (theme) => ({
    type: ActionTypes.SET_THEME,
    payload: theme
});

// UI Actions
export const toggleSidebar = () => ({
    type: ActionTypes.TOGGLE_SIDEBAR
});

export const setActiveSection = (section) => ({
    type: ActionTypes.SET_ACTIVE_SECTION,
    payload: section
});

// Navigation Actions
export const updateCurrentPath = (path) => ({
    type: ActionTypes.UPDATE_CURRENT_PATH,
    payload: path
});

// Loading Actions
export const setLoading = (isLoading) => ({
    type: ActionTypes.SET_LOADING,
    payload: isLoading
});

// Error Actions
export const addError = (error) => ({
    type: ActionTypes.ADD_ERROR,
    payload: error
});

// Legacy support for backward compatibility
export const toggleSection = (section) => setActiveSection(section);
export const setMobileMenu = (isOpen) => toggleSidebar();
export const logoLoaded = () => ({ type: 'LOGO_LOADED' });
export const themeSwitcherInit = () => ({ type: 'THEME_SWITCHER_INIT' });
export const sidebarInit = () => ({ type: 'SIDEBAR_INIT' });
export const addWarning = (warning) => addError(warning); 