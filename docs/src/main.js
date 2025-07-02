// === FlexNet JSX Docs Application Entry Point ===
// Main application orchestrator following FlexNet architecture principles

import Maybe from './core/types/maybe.js';
import Either from './core/types/either.js';
import Result from './core/types/result.js';
import { pipe } from './core/functions/composition.js';
import { getBasePath } from './core/functions/transforms.js';
import { escape } from './security/functions.js';
import { 
    query, 
    fetchResource, 
    safeSetHTML, 
    loadComponent,
    setHTMLEffect,
    addClassEffect,
    removeClassEffect,
    setStyleEffect,
    addEventListenerEffect,
    setLocalStorageEffect,
    getLocalStorageEffect,
    createDOMReadyEffect,
    hasClassEffect
} from './systems/effects/functions.js';
import { setupUI } from './features/ui-setup/index.js';

import { 
    getStore, 
    dispatch, 
    setTheme, 
    logoLoaded, 
    sidebarInit,
    AppActions 
} from './systems/state/store.js';

import { 
    initializeUI 
} from './systems/render/functions.js';

import { 
    executeEffect, 
    logEffect, 
    getCurrentTimeEffect,
    createAsyncEffect,
    createDelayEffect
} from './systems/effects/functions.js';

import { 
    createElement,
    createComponent
} from './core/runtime/factory.js';

import { 
    applyTransformation,
    transformElement
} from './core/runtime/transform.js';

import { 
    createCSPPolicy,
    PREDEFINED_POLICIES 
} from './security/csp.js';

import { 
    sanitizeHTML,
    sanitizeURL 
} from './security/xss.js';

// Pure functional main application initialization using effect system
const initializeApplication = () =>
    executeEffect(logEffect('🚀 Starting FlexNet application initialization'))
        .then(() => {
            const extractPageContent = () =>
                query('#page-content')
                    .map(element => element.innerHTML)
                    .getOrElse('<h1>Welcome to FlexNet JSX</h1><p>Your documentation, powered by functional programming.</p>');

            const initializeMainApp = async () => {
                const pageContent = extractPageContent();
                const basePath = getBasePath();
                const layoutUrl = `${basePath}/templates/layout.html`;
                
                await executeEffect(logEffect(`Fetching layout from: ${layoutUrl}`, 'info'));
                
                return fetchResource(layoutUrl)
                    .then(layoutResult => 
                        layoutResult.type === 'Error'
                            ? handleLayoutError(layoutResult.error)
                            : setupApplicationLayout(layoutResult.value, pageContent, basePath)
                    );
            };

            const handleLayoutError = (error) => {
                const errorHtml = `<div style="color: red; padding: 2rem; font-family: monospace;">
                    <h1>Critical Error</h1>
                    <p>Could not load page layout. Please check the console for more details.</p>
                    <p><strong>Error:</strong> ${escape(error.message || error)}</p>
                </div>`;
                
                return query('#root')
                    .map(rootElement => 
                        executeEffect(logEffect('Rendering error to root element'))
                            .then(() => safeSetHTML(errorHtml)(rootElement))
                    )
                    .getOrElse(
                        executeEffect(logEffect('No root element found, using body'))
                            .then(() => safeSetHTML(errorHtml)(document.body))
                    )
                    .then(() => Result.Error(error));
            };

            const setupApplicationLayout = async (layoutHtml, pageContent, basePath) => {
                const containerElement = Maybe.fromNullable(document.getElementById('root'))
                    .getOrElse(document.body);

                // Use effect system for DOM manipulation
                await executeEffect(setHTMLEffect(containerElement, layoutHtml));
                
                // Load components using effect composition
                const componentLoadingEffects = [
                    loadComponent('header-placeholder', `${basePath}/templates/header.html`),
                    loadComponent('sidebar-placeholder', `${basePath}/templates/sidebar.html`),
                    loadComponent('footer-placeholder', `${basePath}/templates/footer.html`)
                ];
                
                const componentResults = await Promise.all(componentLoadingEffects.map(effect => 
                    effect.then(result => 
                        result.type === 'Error' 
                            ? executeEffect(logEffect(`Component load warning: ${result.error}`, 'warn'))
                            : Result.Ok(result)
                    )
                ));

                // Setup content using effect system
                await setupPageContent(pageContent);
                
                // Delay for DOM settling using effect system
                await executeEffect(createDelayEffect(100));
                
                const uiResults = await setupUI(basePath);
                await setupThemeSystem();
                
                return Result.Ok(uiResults);
            };

            const setupPageContent = async (pageContent) => {
                const contentPlaceholder = query('#content-placeholder');
                
                if (contentPlaceholder.type === 'Just') {
                    await executeEffect(setHTMLEffect(contentPlaceholder.value, pageContent));
                    await executeEffect(setStyleEffect(contentPlaceholder.value, 'display', 'block'));
                } else {
                    await executeEffect(logEffect('Content placeholder not found, trying main element', 'warn'));
                    const mainElement = query('main');
                    if (mainElement.type === 'Just') {
                        const wrappedContent = `<div class="max-w-7xl mx-auto">${pageContent}</div>`;
                        await executeEffect(setHTMLEffect(mainElement.value, wrappedContent));
                    }
                }
            };

            const setupThemeSystem = async () => {
                const themeToggleButton = Maybe.fromNullable(document.getElementById('theme-toggle'));
                
                return themeToggleButton
                    .map(button => {
                        const themeToggleHandler = async () => {
                            const html = document.documentElement;
                            const isDarkResult = await executeEffect(hasClassEffect(html, 'dark'));
                            
                            const isDark = isDarkResult.fold(
                                () => false,  // Error case
                                (hasClass) => hasClass
                            );
                            
                            if (isDark) {
                                await executeEffect(removeClassEffect(html, 'dark'));
                                await executeEffect(setLocalStorageEffect('theme', 'light'));
                            } else {
                                await executeEffect(addClassEffect(html, 'dark'));
                                await executeEffect(setLocalStorageEffect('theme', 'dark'));
                            }
                        };
                        
                        return executeEffect(addEventListenerEffect(button, 'click', themeToggleHandler))
                            .then(() => executeEffect(logEffect('Theme switcher successfully initialized', 'info')));
                    })
                    .getOrElse(
                        executeEffect(logEffect('Theme toggle button not found after component loading', 'warn'))
                    );
            };
            
            return initializeMainApp();
        });

// Use effect system for DOM ready event
const domReadyEffect = createDOMReadyEffect();

executeEffect(domReadyEffect)
    .then(() => initializeApplication())
    .then(result => {
        if (result && result.type === 'Error') {
            executeEffect(logEffect(`Application initialization failed: ${result.error}`, 'error'));
        } else {
            executeEffect(logEffect('✅ Application initialized successfully', 'info'));
        }
    })
    .catch(error => {
        executeEffect(logEffect(`Critical error during site initialization: ${error}`, 'error'));
    });

// ===========================================
// FLEXNET FRAMEWORK INITIALIZATION
// ===========================================

const initializeFlexNet = async (basePath = '.') => {
    return Result.fromTry(async () => {
        // Start initialization tracking
        dispatch({ type: AppActions.INIT_START });
        
        await executeEffect(logEffect('🚀 Starting FlexNet Framework initialization', 'info'));
        
        // Get the store instance
        const store = getStore();
        
        // Apply security policies
        await executeEffect(logEffect('🔒 Applying security policies', 'info'));
        const cspPolicy = createCSPPolicy(PREDEFINED_POLICIES.DEVELOPMENT);
        await executeEffect(cspPolicy);
        
        // Initialize all UI components
        await executeEffect(logEffect('🎨 Initializing UI components', 'info'));
        const uiResults = await executeEffect(initializeUI(basePath));
        
        // Mark initialization complete
        dispatch({ type: AppActions.INIT_COMPLETE });
        
        await executeEffect(logEffect('✅ FlexNet Framework initialization complete', 'info'));
        
        const timestampResult = await executeEffect(getCurrentTimeEffect());
        const timestamp = timestampResult.fold(() => Date.now(), (time) => time);
        
        return {
            success: true,
            store,
            uiResults,
            timestamp
        };
    }).fold(
        async (error) => {
            await executeEffect(logEffect(`❌ FlexNet initialization failed: ${error.message || error}`, 'error'));
            return Either.Left(error);
        },
        (result) => Either.Right(result)
    );
};

// ===========================================
// COMPONENT EXAMPLES
// ===========================================

// Example: Creating a secure component with all systems
const createSecureButton = (text, onClick) => {
    // Sanitize input
    const safeText = sanitizeHTML(text);
    
    // Create element with factory
    const buttonResult = createElement('button', {
        onClick,
        className: 'btn btn-primary',
        'data-component': 'secure-button'
    }, [safeText]);
    
    if (buttonResult.type === 'Right') {
        // Apply transformations
        const transformedButton = applyTransformation(
            transformElement()
                .addClass('hover:bg-blue-600')
                .setAttribute('role', 'button')
                .setAttribute('tabindex', '0')
        )(buttonResult.value);
        
        return transformedButton;
    } else {
        return Either.Left(`Failed to create button: ${buttonResult.value}`);
    }
};

// Example: Theme switcher component using state management
const createThemeSwitcher = () => {
    const store = getStore();
    const currentTheme = store.getState().ui.theme;
    
    const handleClick = async () => {
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        dispatch(setTheme(newTheme));
        
        await executeEffect(logEffect(`Theme switched to: ${newTheme}`, 'info'));
    };
    
    return createSecureButton(
        `Switch to ${currentTheme === 'light' ? 'Dark' : 'Light'} Mode`,
        handleClick
    );
};

// ===========================================
// EFFECT COORDINATION EXAMPLE
// ===========================================

// Example: Complex effect coordination
const performComplexOperation = createAsyncEffect(async () => {
    await executeEffect(logEffect('Starting complex operation', 'info'));
    
    // Multiple effects in sequence
    const timestampResult = await executeEffect(getCurrentTimeEffect());
    const timestamp = timestampResult.fold(() => Date.now(), (time) => time);
    
    // State updates
    dispatch(setLoading(true));
    
    return Result.fromTry(async () => {
        // Simulate async work using effect system
        await executeEffect(createDelayEffect(1000));
        
        // Update state
        dispatch(setLoading(false));
        
        await executeEffect(logEffect('Complex operation completed', 'info'));
        
        return {
            success: true,
            timestamp,
            duration: Date.now() - timestamp
        };
    }).fold(
        async (error) => {
            dispatch(setLoading(false));
            dispatch(addError(error));
            return Either.Left(error);
        },
        (result) => Either.Right(result)
    );
});

// ===========================================
// FRAMEWORK UTILITIES
// ===========================================

// Debug helper for development
const enableDebugMode = () => {
    const store = getStore();
    dispatch({ 
        type: 'SETTINGS/UPDATE_SETTINGS', 
        payload: { debugMode: true, logLevel: 'debug' } 
    });
    
    console.log('🐛 Debug mode enabled');
    console.log('Current state:', store.getState());
    
    // Subscribe to all state changes
    const subscriptionResult = store.subscribe((newState, oldState) => {
        console.group('🔄 State Change');
        console.log('Previous:', oldState);
        console.log('Current:', newState);
        console.groupEnd();
    });
    
    return subscriptionResult;
};

// Performance monitoring
const getPerformanceMetrics = () => {
    const store = getStore();
    const state = store.getState();
    const perf = state.app.performance;
    
    return {
        initializationTime: perf.initEndTime - perf.initStartTime,
        errors: state.app.errors.length,
        warnings: state.app.warnings.length,
        currentTheme: state.ui.theme,
        componentsInitialized: Object.keys(state.components)
            .filter(key => state.components[key].initialized)
            .length
    };
};

// ===========================================
// FRAMEWORK EXPORTS
// ===========================================

// Main framework API
export const FlexNet = Object.freeze({
    // Core initialization
    initialize: initializeFlexNet,
    
    // Component creation
    createElement,
    createComponent,
    createSecureButton,
    createThemeSwitcher,
    
    // State management
    getStore,
    dispatch,
    
    // Effects
    executeEffect,
    performComplexOperation,
    
    // Security
    sanitizeHTML,
    sanitizeURL,
    createCSPPolicy,
    
    // Utilities
    enableDebugMode,
    getPerformanceMetrics
});

// Auto-initialize when DOM is ready using effect system
executeEffect(createDOMReadyEffect())
    .then(() => {
        return initializeFlexNet()
            .then(result => {
                console.log('🎉 FlexNet Framework ready!', result);
                
                // Make framework globally available for debugging
                if (typeof window !== 'undefined') {
                    window.FlexNet = FlexNet;
                }
                return result;
            });
    })
    .catch(error => {
        executeEffect(logEffect(`💥 FlexNet Framework failed to initialize: ${error}`, 'error'));
    });

export default FlexNet;
