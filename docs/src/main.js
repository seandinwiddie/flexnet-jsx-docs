// === FlexNet JSX Docs Application Entry Point ===
// Main application orchestrator following FlexNet architecture principles

import Maybe from './core/types/maybe.js';
import Result from './core/types/result.js';
import { pipe } from './core/functions/composition.js';
import { getBasePath } from './core/functions/transforms.js';
import { escape } from './security/functions.js';
import { query, fetchResource, safeSetHTML, loadComponent } from './systems/effects/functions.js';
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
    createAsyncEffect 
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

document.addEventListener('DOMContentLoaded', () => {

    const init = () => {
        // --- Main Application Logic ---
        const main = async () => {
            console.log("Main function started. Preparing to fetch layout.");
            
            const pageContentElement = query('#page-content');
            let pageContent = '';
            if (pageContentElement.type === 'Just') {
                pageContent = pageContentElement.value.innerHTML;
            } else {
                pageContent = '<h1>Welcome to FlexNet JSX</h1><p>Your documentation, powered by functional programming.</p>';
            }
            
            const basePath = getBasePath();
            const layoutUrl = `${basePath}/templates/layout.html`;
            console.log(`Fetching layout from: ${layoutUrl}`);

            const layoutResult = await fetchResource(layoutUrl);

            if (layoutResult.type === 'Error') {
                console.error("Failed to load layout:", layoutResult.error);
                const root = query('#root');
                pipe(
                    root,
                    Maybe.map(safeSetHTML(
                        `<div style="color: red; padding: 2rem; font-family: monospace;">
                            <h1>Critical Error</h1>
                            <p>Could not load page layout. Please check the console for more details.</p>
                            <p><strong>Error:</strong> ${escape(layoutResult.error.message)}</p>
                        </div>`
                    ))
                );
                return Result.Error(layoutResult.error);
            }
            
            const layoutHtml = layoutResult.value;
            let containerEl = document.getElementById('root');
            if (!containerEl) {
                containerEl = document.body;
            }

            if (containerEl) {
                containerEl.innerHTML = layoutHtml;

                // Load template components into their placeholders
                const headerResult = await loadComponent('header-placeholder', `${basePath}/templates/header.html`);
                if (headerResult.type === 'Error') {
                    console.warn('Failed to load header:', headerResult.error);
                }
                
                const sidebarResult = await loadComponent('sidebar-placeholder', `${basePath}/templates/sidebar.html`);
                if (sidebarResult.type === 'Error') {
                    console.warn('Failed to load sidebar:', sidebarResult.error);
                }
                
                const footerResult = await loadComponent('footer-placeholder', `${basePath}/templates/footer.html`);
                if (footerResult.type === 'Error') {
                    console.warn('Failed to load footer:', footerResult.error);
                }

                const contentPlaceholder = query('#content-placeholder');
                if (contentPlaceholder.type === 'Just') {
                    const el = contentPlaceholder.value;
                    el.innerHTML = pageContent;
                    el.style.display = 'block'; // Make sure content is visible
                } else {
                    console.warn("Content placeholder element #content-placeholder not found!");
                    // Fallback: try to set content in the main element
                    const mainElement = query('main');
                    if (mainElement.type === 'Just') {
                        mainElement.value.innerHTML = `<div class="max-w-7xl mx-auto">${pageContent}</div>`;
                    }
                }
                
                // Wait a moment for DOM to settle, then setup UI
                await new Promise(resolve => setTimeout(resolve, 100));
                const uiResults = await setupUI(basePath);
                
                // Setup theme switcher after all components are loaded
                const themeToggleButton = document.getElementById('theme-toggle');
                if(themeToggleButton) {
                    themeToggleButton.addEventListener('click', function() {
                        const html = document.documentElement;
                        html.classList.toggle('dark');
                        
                        if (html.classList.contains('dark')) {
                            localStorage.setItem('theme', 'dark');
                        } else {
                            localStorage.setItem('theme', 'light');
                        }
                    });
                    console.log("[UI Setup] Theme switcher successfully initialized.");
                } else {
                    console.warn("[UI Setup] Theme toggle button #theme-toggle not found after component loading!");
                }
                
                return Result.Ok(uiResults);
            } else {
                const error = new Error('CRITICAL: No container element found (#root or body).');
                console.error(error.message);
                return Result.Error(error);
            }
        };

        main().then(result => {
            if (result.type === 'Error') {
                console.error('Application initialization failed:', result.error);
            } else {
                console.log('Application initialized successfully');
            }
        }).catch(console.error);
    };
    
    try {
        init();
    } catch (e) {
        console.error("A critical error occurred during site initialization:", e);
    }
});

// ===========================================
// FLEXNET FRAMEWORK INITIALIZATION
// ===========================================

const initializeFlexNet = async (basePath = '.') => {
    try {
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
        
        return {
            success: true,
            store,
            uiResults,
            timestamp: await executeEffect(getCurrentTimeEffect())
        };
        
    } catch (error) {
        await executeEffect(logEffect(`❌ FlexNet initialization failed: ${error.message}`, 'error'));
        throw error;
    }
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
        throw new Error(`Failed to create button: ${buttonResult.value}`);
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
    const timestamp = await executeEffect(getCurrentTimeEffect());
    
    // State updates
    dispatch(setLoading(true));
    
    try {
        // Simulate async work
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Update state
        dispatch(setLoading(false));
        
        await executeEffect(logEffect('Complex operation completed', 'info'));
        
        return {
            success: true,
            timestamp,
            duration: Date.now() - timestamp
        };
    } catch (error) {
        dispatch(setLoading(false));
        dispatch(addError(error));
        throw error;
    }
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
    store.subscribe((newState, oldState) => {
        console.group('🔄 State Change');
        console.log('Previous:', oldState);
        console.log('Current:', newState);
        console.groupEnd();
    });
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

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initializeFlexNet()
            .then(result => {
                console.log('🎉 FlexNet Framework ready!', result);
                
                // Make framework globally available for debugging
                if (typeof window !== 'undefined') {
                    window.FlexNet = FlexNet;
                }
            })
            .catch(error => {
                console.error('💥 FlexNet Framework failed to initialize:', error);
            });
    });
} else {
    // DOM already loaded
    initializeFlexNet()
        .then(result => {
            console.log('🎉 FlexNet Framework ready!', result);
            
            if (typeof window !== 'undefined') {
                window.FlexNet = FlexNet;
            }
        })
        .catch(error => {
            console.error('💥 FlexNet Framework failed to initialize:', error);
        });
}

export default FlexNet;
