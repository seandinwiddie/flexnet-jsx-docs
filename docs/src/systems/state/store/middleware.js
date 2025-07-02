// === FlexNet State Store Middleware ===
// Simplified middleware for basic functionality

// ===========================================
// PERSISTENCE MIDDLEWARE
// ===========================================

export const createPersistenceMiddleware = (store) => {
    const persistState = () => {
        try {
            const state = store.getState();
            const persistData = {
                ui: { theme: state.ui?.theme },
                navigation: { currentPath: state.navigation?.currentPath }
            };
            localStorage.setItem('flexnet-app-state', JSON.stringify(persistData));
        } catch (error) {
            console.warn('Failed to persist state:', error);
        }
    };
    
    return persistState;
};

// ===========================================
// EFFECT MIDDLEWARE
// ===========================================

export const createEffectMiddleware = (store) => {
    const handleEffects = (action) => {
        // Simple effect handling - could be expanded
        if (action.type === 'SET_THEME') {
            // Apply theme to document
            if (action.payload === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
    };
    
    return handleEffects;
};

// ===========================================
// LOGGING MIDDLEWARE
// ===========================================

export const createLoggingMiddleware = (store) => {
    const logAction = (action, prevState, newState) => {
        if (newState.app?.debugMode) {
            console.group(`Action: ${action.type}`);
            console.log('Payload:', action.payload);
            console.log('Previous State:', prevState);
            console.log('New State:', newState);
            console.groupEnd();
        }
    };
    
    return logAction;
}; 