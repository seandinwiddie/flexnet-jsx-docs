// === FlexNet State Store Schema ===
// Simplified state schema for docs website

// ===========================================
// INITIAL STATE SCHEMA
// ===========================================

export const createAppStateSchema = () => ({
    ui: {
        theme: 'light',
        sidebarOpen: false,
        activeSection: null
    },
    navigation: {
        currentPath: '/'
    },
    app: {
        initialized: false,
        loading: false,
        errors: [],
        initializationTime: null
    }
});

// ===========================================
// STATE VALIDATION
// ===========================================

export const stateValidationSchema = (state) => {
    try {
        // Basic validation
        if (!state || typeof state !== 'object') {
            return { valid: false, errors: ['State must be an object'] };
        }
        
        const errors = [];
        
        // Validate UI state
        if (state.ui) {
            if (state.ui.theme && !['light', 'dark'].includes(state.ui.theme)) {
                errors.push('Invalid theme value');
            }
            if (state.ui.sidebarOpen !== undefined && typeof state.ui.sidebarOpen !== 'boolean') {
                errors.push('sidebarOpen must be boolean');
            }
        }
        
        // Validate navigation state
        if (state.navigation) {
            if (state.navigation.currentPath && typeof state.navigation.currentPath !== 'string') {
                errors.push('currentPath must be string');
            }
        }
        
        // Validate app state
        if (state.app) {
            if (state.app.loading !== undefined && typeof state.app.loading !== 'boolean') {
                errors.push('loading must be boolean');
            }
            if (state.app.errors && !Array.isArray(state.app.errors)) {
                errors.push('errors must be array');
            }
        }
        
        return {
            valid: errors.length === 0,
            errors
        };
    } catch (error) {
        return {
            valid: false,
            errors: [`Validation error: ${error.message}`]
        };
    }
};

// ===========================================
// SCHEMA UTILITIES
// ===========================================

export const validateStateShape = (state) => {
    const validation = stateValidationSchema(state);
    return validation.valid;
};

export const normalizeState = (partialState) => {
    const defaultState = createAppStateSchema();
    return {
        ...defaultState,
        ...partialState,
        ui: { ...defaultState.ui, ...(partialState.ui || {}) },
        navigation: { ...defaultState.navigation, ...(partialState.navigation || {}) },
        app: { ...defaultState.app, ...(partialState.app || {}) }
    };
}; 