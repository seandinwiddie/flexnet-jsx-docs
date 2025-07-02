import { pipe } from '../../../core/functions/composition.js';
import { ActionTypes } from './actions.js';

// ===========================================
// SIMPLE STATE REDUCERS
// ===========================================

// Root reducer - handles all actions
export const rootReducer = (state, action) => {
    switch (action.type) {
        case ActionTypes.SET_THEME:
            return {
                ...state,
                ui: {
                    ...state.ui,
                    theme: action.payload
                }
            };
            
        case ActionTypes.TOGGLE_SIDEBAR:
            return {
                ...state,
                ui: {
                    ...state.ui,
                    sidebarOpen: !state.ui.sidebarOpen
                }
            };
            
        case ActionTypes.SET_ACTIVE_SECTION:
            return {
                ...state,
                ui: {
                    ...state.ui,
                    activeSection: action.payload
                }
            };
            
        case ActionTypes.UPDATE_CURRENT_PATH:
            return {
                ...state,
                navigation: {
                    ...state.navigation,
                    currentPath: action.payload
                }
            };
            
        case ActionTypes.SET_LOADING:
            return {
                ...state,
                app: {
                    ...state.app,
                    loading: action.payload
                }
            };
            
        case ActionTypes.ADD_ERROR:
            return {
                ...state,
                app: {
                    ...state.app,
                    errors: [...state.app.errors, action.payload]
                }
            };
            
        default:
            return state;
    }
};

// Helper reducers for specific domains
export const uiReducer = (uiState, action) => {
    const fullState = { ui: uiState };
    const newState = rootReducer(fullState, action);
    return newState.ui;
};

export const navigationReducer = (navState, action) => {
    const fullState = { navigation: navState };
    const newState = rootReducer(fullState, action);
    return newState.navigation;
};

export const appReducer = (appState, action) => {
    const fullState = { app: appState };
    const newState = rootReducer(fullState, action);
    return newState.app;
}; 