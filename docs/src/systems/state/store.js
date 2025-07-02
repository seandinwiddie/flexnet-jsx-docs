// === FlexNet Central State Store ===
// Immutable state management with effect coordination

import Maybe from '../../core/types/maybe.js';
import Either from '../../core/types/either.js';
import Result from '../../core/types/result.js';
import { compose, pipe, curry } from '../../core/functions/composition.js';
import { 
    createState, 
    createReducer, 
    updateProperty, 
    setProperty, 
    mergeObject,
    validateState,
    createLens,
    pathLens,
    combineStates,
    persistState,
    loadPersistedState,
    createStateLogger
} from './functions.js';
import { 
    executeEffect, 
    logEffect, 
    setLocalStorageEffect,
    getLocalStorageEffect
} from '../effects/functions.js';

// ===========================================
// APPLICATION STATE SCHEMA
// ===========================================

// Define the complete application state structure
const createAppStateSchema = () => Object.freeze({
    // UI State
    ui: Object.freeze({
        theme: 'light', // 'light' | 'dark'
        sidebarOpen: false,
        activeSection: null,
        expandedSections: [],
        mobileMenuOpen: false,
        currentPath: window.location.pathname,
        isLoading: false
    }),
    
    // Component State
    components: Object.freeze({
        logo: Object.freeze({
            loaded: false,
            src: null,
            basePath: null
        }),
        
        themeSwitcher: Object.freeze({
            initialized: false,
            preference: 'auto' // 'light' | 'dark' | 'auto'
        }),
        
        sidebar: Object.freeze({
            initialized: false,
            sections: [],
            activeLinkHighlighted: false
        }),
        
        syntaxHighlighting: Object.freeze({
            initialized: false,
            library: 'hljs'
        }),
        
        copyButtons: Object.freeze({
            initialized: false,
            count: 0
        })
    }),
    
    // Application State
    app: Object.freeze({
        initialized: false,
        version: '1.0.0',
        errors: [],
        warnings: [],
        performance: Object.freeze({
            initStartTime: null,
            initEndTime: null,
            renderTimes: []
        })
    }),
    
    // Settings
    settings: Object.freeze({
        persistState: true,
        debugMode: false,
        logLevel: 'info', // 'debug' | 'info' | 'warn' | 'error'
        effectTracking: false,
        performanceMonitoring: true
    })
});

// State validation schema
const stateValidationSchema = Object.freeze({
    ui: Object.freeze({
        theme: value => ['light', 'dark'].includes(value) 
            ? Either.Right(value) 
            : Either.Left('Theme must be light or dark'),
        sidebarOpen: value => typeof value === 'boolean'
            ? Either.Right(value)
            : Either.Left('sidebarOpen must be boolean'),
        currentPath: value => typeof value === 'string'
            ? Either.Right(value)
            : Either.Left('currentPath must be string')
    }),
    app: Object.freeze({
        initialized: value => typeof value === 'boolean'
            ? Either.Right(value)
            : Either.Left('initialized must be boolean')
    })
});

// ===========================================
// ACTION DEFINITIONS
// ===========================================

// UI Actions
export const UIActions = Object.freeze({
    SET_THEME: 'UI/SET_THEME',
    TOGGLE_SIDEBAR: 'UI/TOGGLE_SIDEBAR',
    SET_ACTIVE_SECTION: 'UI/SET_ACTIVE_SECTION',
    TOGGLE_SECTION: 'UI/TOGGLE_SECTION',
    SET_MOBILE_MENU: 'UI/SET_MOBILE_MENU',
    UPDATE_CURRENT_PATH: 'UI/UPDATE_CURRENT_PATH',
    SET_LOADING: 'UI/SET_LOADING'
});

// Component Actions
export const ComponentActions = Object.freeze({
    LOGO_LOADED: 'COMPONENTS/LOGO_LOADED',
    THEME_SWITCHER_INIT: 'COMPONENTS/THEME_SWITCHER_INIT',
    SIDEBAR_INIT: 'COMPONENTS/SIDEBAR_INIT',
    SYNTAX_HIGHLIGHTING_INIT: 'COMPONENTS/SYNTAX_HIGHLIGHTING_INIT',
    COPY_BUTTONS_INIT: 'COMPONENTS/COPY_BUTTONS_INIT',
    UPDATE_SIDEBAR_SECTIONS: 'COMPONENTS/UPDATE_SIDEBAR_SECTIONS'
});

// App Actions
export const AppActions = Object.freeze({
    INIT_START: 'APP/INIT_START',
    INIT_COMPLETE: 'APP/INIT_COMPLETE',
    ADD_ERROR: 'APP/ADD_ERROR',
    ADD_WARNING: 'APP/ADD_WARNING',
    CLEAR_ERRORS: 'APP/CLEAR_ERRORS',
    UPDATE_PERFORMANCE: 'APP/UPDATE_PERFORMANCE'
});

// Settings Actions
export const SettingsActions = Object.freeze({
    UPDATE_SETTINGS: 'SETTINGS/UPDATE_SETTINGS',
    TOGGLE_DEBUG: 'SETTINGS/TOGGLE_DEBUG',
    SET_LOG_LEVEL: 'SETTINGS/SET_LOG_LEVEL'
});

// ===========================================
// ACTION CREATORS
// ===========================================

// UI Action Creators
export const setTheme = (theme) => ({
    type: UIActions.SET_THEME,
    payload: { theme }
});

export const toggleSidebar = () => ({
    type: UIActions.TOGGLE_SIDEBAR
});

export const setActiveSection = (section) => ({
    type: UIActions.SET_ACTIVE_SECTION,
    payload: { section }
});

export const toggleSection = (sectionId) => ({
    type: UIActions.TOGGLE_SECTION,
    payload: { sectionId }
});

export const setMobileMenu = (open) => ({
    type: UIActions.SET_MOBILE_MENU,
    payload: { open }
});

export const updateCurrentPath = (path) => ({
    type: UIActions.UPDATE_CURRENT_PATH,
    payload: { path }
});

export const setLoading = (loading) => ({
    type: UIActions.SET_LOADING,
    payload: { loading }
});

// Component Action Creators
export const logoLoaded = (src, basePath) => ({
    type: ComponentActions.LOGO_LOADED,
    payload: { src, basePath }
});

export const themeSwitcherInit = () => ({
    type: ComponentActions.THEME_SWITCHER_INIT
});

export const sidebarInit = (sections) => ({
    type: ComponentActions.SIDEBAR_INIT,
    payload: { sections }
});

export const addError = (error, context = {}) => ({
    type: AppActions.ADD_ERROR,
    payload: { error: error.message || String(error), context, timestamp: Date.now() }
});

export const addWarning = (warning, context = {}) => ({
    type: AppActions.ADD_WARNING,
    payload: { warning, context, timestamp: Date.now() }
});

// ===========================================
// REDUCERS
// ===========================================

// UI Reducer
const uiReducer = (state, action) => {
    switch (action.type) {
        case UIActions.SET_THEME:
            return setProperty('theme', action.payload.theme, state);
            
        case UIActions.TOGGLE_SIDEBAR:
            return updateProperty('sidebarOpen', open => !open, state);
            
        case UIActions.SET_ACTIVE_SECTION:
            return setProperty('activeSection', action.payload.section, state);
            
        case UIActions.TOGGLE_SECTION:
            const { sectionId } = action.payload;
            return updateProperty('expandedSections', sections => {
                const isExpanded = sections.includes(sectionId);
                return isExpanded 
                    ? sections.filter(id => id !== sectionId)
                    : [...sections, sectionId];
            }, state);
            
        case UIActions.SET_MOBILE_MENU:
            return setProperty('mobileMenuOpen', action.payload.open, state);
            
        case UIActions.UPDATE_CURRENT_PATH:
            return setProperty('currentPath', action.payload.path, state);
            
        case UIActions.SET_LOADING:
            return setProperty('isLoading', action.payload.loading, state);
            
        default:
            return state;
    }
};

// Components Reducer
const componentsReducer = (state, action) => {
    switch (action.type) {
        case ComponentActions.LOGO_LOADED:
            return mergeObject('logo', {
                loaded: true,
                src: action.payload.src,
                basePath: action.payload.basePath
            }, state);
            
        case ComponentActions.THEME_SWITCHER_INIT:
            return setProperty('themeSwitcher', { initialized: true }, state);
            
        case ComponentActions.SIDEBAR_INIT:
            return mergeObject('sidebar', {
                initialized: true,
                sections: action.payload.sections
            }, state);
            
        case ComponentActions.SYNTAX_HIGHLIGHTING_INIT:
            return setProperty('syntaxHighlighting', { initialized: true }, state);
            
        case ComponentActions.COPY_BUTTONS_INIT:
            return mergeObject('copyButtons', {
                initialized: true,
                count: action.payload.count || 0
            }, state);
            
        default:
            return state;
    }
};

// App Reducer
const appReducer = (state, action) => {
    switch (action.type) {
        case AppActions.INIT_START:
            return mergeObject('performance', {
                initStartTime: Date.now()
            }, state);
            
        case AppActions.INIT_COMPLETE:
            return pipe(
                setProperty('initialized', true),
                mergeObject('performance', {
                    initEndTime: Date.now()
                })
            )(state);
            
        case AppActions.ADD_ERROR:
            return updateProperty('errors', errors => [...errors, action.payload], state);
            
        case AppActions.ADD_WARNING:
            return updateProperty('warnings', warnings => [...warnings, action.payload], state);
            
        case AppActions.CLEAR_ERRORS:
            return setProperty('errors', [], state);
            
        case AppActions.UPDATE_PERFORMANCE:
            return mergeObject('performance', action.payload, state);
            
        default:
            return state;
    }
};

// Settings Reducer
const settingsReducer = (state, action) => {
    switch (action.type) {
        case SettingsActions.UPDATE_SETTINGS:
            return { ...state, ...action.payload };
            
        case SettingsActions.TOGGLE_DEBUG:
            return updateProperty('debugMode', debug => !debug, state);
            
        case SettingsActions.SET_LOG_LEVEL:
            return setProperty('logLevel', action.payload.level, state);
            
        default:
            return state;
    }
};

// Root Reducer
const rootReducer = (state, action) => {
    const [domain] = action.type.split('/');
    
    switch (domain) {
        case 'UI':
            return updateProperty('ui', uiState => uiReducer(uiState, action), state);
            
        case 'COMPONENTS':
            return updateProperty('components', compState => componentsReducer(compState, action), state);
            
        case 'APP':
            return updateProperty('app', appState => appReducer(appState, action), state);
            
        case 'SETTINGS':
            return updateProperty('settings', settingsState => settingsReducer(settingsState, action), state);
            
        default:
            return state;
    }
};

// ===========================================
// STORE CREATION AND MANAGEMENT
// ===========================================

// Create the central application store
const createAppStore = () => {
    const initialState = createAppStateSchema();
    
    // Load persisted state
    const persistedState = loadPersistedState('flexnet-app-state', {})
        .fold(
            error => {
                console.warn('Failed to load persisted state:', error);
                return {};
            },
            state => state
        );
    
    // Merge with initial state
    const mergedState = {
        ...initialState,
        ...persistedState,
        // Always start fresh with these
        app: {
            ...initialState.app,
            initialized: false,
            errors: [],
            warnings: []
        }
    };
    
    // Create the store
    const store = createReducer(mergedState, {
        [UIActions.SET_THEME]: rootReducer,
        [UIActions.TOGGLE_SIDEBAR]: rootReducer,
        [UIActions.SET_ACTIVE_SECTION]: rootReducer,
        [UIActions.TOGGLE_SECTION]: rootReducer,
        [UIActions.SET_MOBILE_MENU]: rootReducer,
        [UIActions.UPDATE_CURRENT_PATH]: rootReducer,
        [UIActions.SET_LOADING]: rootReducer,
        
        [ComponentActions.LOGO_LOADED]: rootReducer,
        [ComponentActions.THEME_SWITCHER_INIT]: rootReducer,
        [ComponentActions.SIDEBAR_INIT]: rootReducer,
        [ComponentActions.SYNTAX_HIGHLIGHTING_INIT]: rootReducer,
        [ComponentActions.COPY_BUTTONS_INIT]: rootReducer,
        
        [AppActions.INIT_START]: rootReducer,
        [AppActions.INIT_COMPLETE]: rootReducer,
        [AppActions.ADD_ERROR]: rootReducer,
        [AppActions.ADD_WARNING]: rootReducer,
        [AppActions.CLEAR_ERRORS]: rootReducer,
        [AppActions.UPDATE_PERFORMANCE]: rootReducer,
        
        [SettingsActions.UPDATE_SETTINGS]: rootReducer,
        [SettingsActions.TOGGLE_DEBUG]: rootReducer,
        [SettingsActions.SET_LOG_LEVEL]: rootReducer
    });
    
    return store;
};

// ===========================================
// STATE SELECTORS
// ===========================================

// Create lenses for efficient state access
export const stateLenses = Object.freeze({
    ui: pathLens(['ui']),
    components: pathLens(['components']),
    app: pathLens(['app']),
    settings: pathLens(['settings']),
    
    // Specific UI selectors
    theme: pathLens(['ui', 'theme']),
    sidebarOpen: pathLens(['ui', 'sidebarOpen']),
    activeSection: pathLens(['ui', 'activeSection']),
    expandedSections: pathLens(['ui', 'expandedSections']),
    currentPath: pathLens(['ui', 'currentPath']),
    
    // Component selectors
    logoState: pathLens(['components', 'logo']),
    sidebarState: pathLens(['components', 'sidebar']),
    
    // App selectors
    isInitialized: pathLens(['app', 'initialized']),
    errors: pathLens(['app', 'errors']),
    warnings: pathLens(['app', 'warnings'])
});

// Selector functions
export const selectTheme = (state) => stateLenses.theme.get(state);
export const selectSidebarOpen = (state) => stateLenses.sidebarOpen.get(state);
export const selectActiveSection = (state) => stateLenses.activeSection.get(state);
export const selectCurrentPath = (state) => stateLenses.currentPath.get(state);
export const selectIsInitialized = (state) => stateLenses.isInitialized.get(state);
export const selectErrors = (state) => stateLenses.errors.get(state);

// Computed selectors
export const selectIsLoading = (state) => 
    !selectIsInitialized(state) || state.ui.isLoading;

export const selectHasErrors = (state) => 
    selectErrors(state).length > 0;

export const selectInitializationTime = (state) => {
    const perf = state.app.performance;
    return perf.initEndTime && perf.initStartTime 
        ? perf.initEndTime - perf.initStartTime 
        : null;
};

// ===========================================
// STORE MIDDLEWARE AND EFFECTS
// ===========================================

// Effect middleware for handling side effects
const createEffectMiddleware = (store) => {
    const middleware = (action) => {
        const state = store.getState();
        
        // Handle theme changes
        if (action.type === UIActions.SET_THEME) {
            executeEffect(setLocalStorageEffect('theme', action.payload.theme))
                .catch(error => console.warn('Failed to persist theme:', error));
        }
        
        // Handle path changes
        if (action.type === UIActions.UPDATE_CURRENT_PATH) {
            // Could trigger navigation effects here
            executeEffect(logEffect(`Navigation to: ${action.payload.path}`, 'info'))
                .catch(error => console.warn('Failed to log navigation:', error));
        }
        
        // Handle errors
        if (action.type === AppActions.ADD_ERROR) {
            executeEffect(logEffect(`Error: ${action.payload.error}`, 'error'))
                .catch(error => console.warn('Failed to log error:', error));
        }
        
        return action;
    };
    
    return middleware;
};

// State persistence middleware
const createPersistenceMiddleware = (store) => {
    let persistTimeout = null;
    
    const middleware = () => {
        // Debounce persistence
        if (persistTimeout) {
            clearTimeout(persistTimeout);
        }
        
        persistTimeout = setTimeout(() => {
            const state = store.getState();
            if (state.settings.persistState) {
                // Only persist certain parts of state
                const stateToPersist = {
                    ui: {
                        theme: state.ui.theme,
                        expandedSections: state.ui.expandedSections
                    },
                    settings: state.settings
                };
                
                executeEffect(setLocalStorageEffect('flexnet-app-state', stateToPersist))
                    .catch(error => console.warn('Failed to persist state:', error));
            }
        }, 300);
    };
    
    return middleware;
};

// ===========================================
// STORE INSTANCE AND EXPORTS
// ===========================================

// Create the global store instance
let globalStore = null;

export const getStore = () => {
    if (!globalStore) {
        globalStore = createAppStore();
        
        // Add middleware
        const effectMiddleware = createEffectMiddleware(globalStore);
        const persistenceMiddleware = createPersistenceMiddleware(globalStore);
        
        // Subscribe to state changes
        globalStore.subscribe((newState, oldState) => {
            // Run middleware
            persistenceMiddleware();
            
            // Log state changes in debug mode
            if (newState.settings.debugMode) {
                console.group('State Change');
                console.log('Previous:', oldState);
                console.log('Current:', newState);
                console.groupEnd();
            }
        });
        
        // Setup state logger in debug mode
        if (globalStore.getState().settings.debugMode) {
            createStateLogger(globalStore, 'FlexNet App Store');
        }
    }
    
    return globalStore;
};

// Convenience functions
export const dispatch = (action) => {
    const store = getStore();
    return store.dispatch(action);
};

export const getState = () => {
    const store = getStore();
    return store.getState();
};

export const subscribe = (listener) => {
    const store = getStore();
    return store.subscribe(listener);
};

// State validation
export const validateAppState = (state) =>
    validateState(stateValidationSchema, state);

// Export action types for external use
export const ActionTypes = Object.freeze({
    ...UIActions,
    ...ComponentActions,
    ...AppActions,
    ...SettingsActions
});

// Export the store utilities
export const StoreUtils = Object.freeze({
    getStore,
    dispatch,
    getState,
    subscribe,
    validateAppState,
    stateLenses,
    createAppStateSchema
});
