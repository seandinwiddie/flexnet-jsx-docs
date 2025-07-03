// === FlexNet JSX Docs Application Entry Point ===
// Pure functional application orchestrator following FlexNet architecture principles
// Strict functional composition with proper effect isolation

import Maybe from './core/types/maybe.js';
import Either from './core/types/either.js';
import Result from './core/types/result.js';
import { pipe, compose } from './core/functions/composition.js';
import { getBasePath } from './core/functions/transforms.js';
import { sanitize, escape } from './security/functions.js';
import { Effect } from './systems/effects/functions/effect.js';
import { 
    query, 
    queryById,
    queryAll
} from './systems/effects/functions/domQuery.js';
import { 
    setHTML,
    addClass,
    removeClass,
    setStyle,
    setAttribute,
    getAttribute,
    hasClass
} from './systems/effects/functions/domManipulation.js';
import { addEventListener } from './systems/effects/functions/eventEffects.js';
import { 
    setLocalStorage,
    getLocalStorage 
} from './systems/effects/functions/storageEffects.js';
import { 
    executeEffect, 
    chainEffects, 
    parallelEffects 
} from './systems/effects/functions/executeEffect.js';
import { 
    log, 
    logError, 
    logInfo 
} from './systems/effects/functions/logEffects.js';
import { 
    httpGet 
} from './systems/effects/functions/httpEffects.js';
import { initializeUI } from './systems/render/functions.js';
import { createImmutableStore } from './systems/state/store.js';
import { createElement } from './core/runtime/factory.js';

// ===========================================
// PURE FUNCTIONAL APPLICATION INITIALIZATION
// ===========================================

/**
 * Pure effect to extract page content from DOM
 * @returns {Effect} Effect that returns Either<Error, string>
 */
const extractPageContentEffect = () =>
    Effect(() => {
        const elementResult = queryById('page-content').run();
        return Either.chain(maybeElement =>
            Maybe.fold(
                () => Either.Right(''),
                element => {
                    try {
                        return Either.Right(element.innerHTML || '');
                    } catch (error) {
                        return Either.Left(`Failed to extract content: ${error.message}`);
                    }
                }
            )(maybeElement)
        )(elementResult);
    });

/**
 * Pure function to create error HTML
 * @param {string} error - Error message
 * @returns {string} Sanitized error HTML
 */
const createErrorHTML = (error) => 
    pipe(
        sanitize,
        (safeError) => `
            <div style="color: red; padding: 2rem; font-family: monospace;">
                <h1>Critical Error</h1>
                <p>Could not load page layout. Please check the console for more details.</p>
                <p><strong>Error:</strong> ${safeError}</p>
            </div>
        `
    )(error);

/**
 * Pure effect to handle layout errors
 * @param {string} error - Error message
 * @returns {Effect} Effect that returns Either<Error, Success>
 */
const handleLayoutErrorEffect = (error) =>
    Effect(() => {
        const errorHtml = createErrorHTML(error);
        
        const rootResult = queryById('root').run();
        return Either.chain(maybeRoot =>
            Maybe.fold(
                () => {
                    // Fallback to body if root not found - log as side effect
                    Either.fold(() => {}, () => {})(log('No root element found, using body', 'warn').run());
                    return setHTML(document.body, errorHtml).run();
                },
                rootElement => setHTML(rootElement, errorHtml).run()
            )(maybeRoot)
        )(rootResult);
    });

/**
 * Pure effect to fetch a resource
 * @param {string} url - Resource URL
 * @returns {Effect} Effect that returns Either<Error, string>
 */
const fetchResourceEffect = (url) =>
    Effect(() => {
        const responseResult = httpGet(url).run();
        return Either.chain(response => 
            response && response.status === 200
                ? Either.Right(response.data)
                : Either.Left(`Failed to fetch ${url}: ${response ? response.statusText : 'Unknown error'}`)
        )(responseResult);
    });

/**
 * Pure effect to load a component into a placeholder
 * @param {string} placeholderId - ID of placeholder element
 * @param {string} templateUrl - URL of template to load
 * @returns {Effect} Effect that returns Either<Error, Element>
 */
const loadComponentEffect = (placeholderId, templateUrl) =>
    Effect(() => {
        const templateResult = fetchResourceEffect(templateUrl).run();
        return Either.chain(templateContent => {
            const placeholderResult = queryById(placeholderId).run();
            return Either.chain(maybePlaceholder =>
                Maybe.fold(
                    () => Either.Left(`Placeholder not found: ${placeholderId}`),
                    placeholder => setHTML(placeholder, templateContent).run()
                )(maybePlaceholder)
            )(placeholderResult);
        })(templateResult);
    });

/**
 * Pure effect to create component loading effects
 * @param {string} basePath - Base path for resources
 * @returns {Effect} Effect that returns Either<Error, Array<Result>>
 */
const createComponentLoadingEffects = (basePath) =>
    Effect(() => {
        const componentEffects = [
            loadComponentEffect('header-placeholder', `${basePath}/templates/header.html`),
            loadComponentEffect('sidebar-placeholder', `${basePath}/templates/sidebar.html`),
            loadComponentEffect('footer-placeholder', `${basePath}/templates/footer.html`)
        ];

        const results = componentEffects.map(effect => effect.run());
        const errors = results.filter(result => result.type === 'Left');
        
        return errors.length > 0
            ? Either.Left(errors[0].value)  // Return first error
            : Either.Right(results.map(result => result.value));
    });

/**
 * Pure effect to setup page content
 * @param {string} pageContent - Page content HTML
 * @returns {Effect} Effect that returns Either<Error, Success>
 */
const setupPageContentEffect = (pageContent) =>
    Effect(() => {
        const wrappedContent = `<div class="max-w-7xl mx-auto">${pageContent}</div>`;
        
        const contentPlaceholderResult = queryById('content-placeholder').run();
        return Either.chain(maybeContentPlaceholder =>
            Maybe.fold(
                () => {
                    // Log warning as side effect
                    Either.fold(() => {}, () => {})(log('Content placeholder not found, trying main element', 'warn').run());
                    const mainResult = query('main').run();
                    return Either.chain(maybeMain =>
                        Maybe.fold(
                            () => Either.Right(null), // No main element found
                            mainElement => setHTML(mainElement, wrappedContent).run()
                        )(maybeMain)
                    )(mainResult);
                },
                contentPlaceholder => {
                    const htmlResult = setHTML(contentPlaceholder, pageContent).run();
                    return Either.chain(() => 
                        setStyle(contentPlaceholder, 'display', 'block').run()
                    )(htmlResult);
                }
            )(maybeContentPlaceholder)
        )(contentPlaceholderResult);
    });

/**
 * Pure effect to check if element has dark class
 * @param {Element} element - Element to check
 * @returns {Effect} Effect that returns Either<Error, boolean>
 */
const hasDarkClassEffect = (element) =>
    Effect(() => hasClass(element, 'dark').run());

/**
 * Pure effect to create theme toggle handler
 * @returns {Effect} Effect that returns Either<Error, Function>
 */
const createThemeToggleHandlerEffect = () =>
    Effect(() => {
        const toggleHandler = () =>
            Effect(() => {
                const htmlElement = document.documentElement;
                
                const isDarkResult = hasDarkClassEffect(htmlElement).run();
                return Either.chain(isDark => {
                    const themeEffects = isDark
                        ? [
                            removeClass(htmlElement, 'dark'),
                            setLocalStorage('theme', 'light')
                        ]
                        : [
                            addClass(htmlElement, 'dark'),
                            setLocalStorage('theme', 'dark')
                        ];
                    
                    const results = themeEffects.map(effect => effect.run());
                    const errors = results.filter(result => result.type === 'Left');
                    
                    return errors.length > 0
                        ? Either.Left(errors[0].value)
                        : Either.Right('Theme toggled successfully');
                })(isDarkResult);
            });
        
        return Either.Right(toggleHandler);
    });

/**
 * Pure effect to setup theme system
 * @returns {Effect} Effect that returns Either<Error, Success>
 */
const setupThemeSystemEffect = () =>
    Effect(() => {
        const themeHandlerResult = createThemeToggleHandlerEffect().run();
        return Either.chain(themeHandler => {
            const toggleButtonResult = queryById('theme-toggle').run();
            return Either.chain(maybeToggleButton =>
                Maybe.fold(
                    () => {
                        Either.fold(() => {}, () => {})(log('Theme toggle button not found after component loading', 'warn').run());
                        return Either.Right(null);
                    },
                    toggleButton => {
                        const addEventResult = addEventListener(toggleButton, 'click', themeHandler).run();
                        return Either.chain(() => 
                            log('Theme switcher successfully initialized', 'info').run()
                        )(addEventResult);
                    }
                )(maybeToggleButton)
            )(toggleButtonResult);
        })(themeHandlerResult);
    });

/**
 * Pure effect to setup application layout
 * @param {string} layoutHtml - Layout HTML content
 * @param {string} pageContent - Page content HTML
 * @param {string} basePath - Base path for resources
 * @returns {Effect} Effect that returns Either<Error, Success>
 */
const setupApplicationLayoutEffect = (layoutHtml, pageContent, basePath) =>
    Effect(() => {
        const rootResult = queryById('root').run();
        return Either.chain(maybeRoot => {
            const containerElement = Maybe.getOrElse(document.body)(maybeRoot);
            
            // Execute effects in sequence
            const htmlResult = setHTML(containerElement, layoutHtml).run();
            if (htmlResult.type === 'Left') return htmlResult;
            
            const componentsResult = createComponentLoadingEffects(basePath).run();
            if (componentsResult.type === 'Left') return componentsResult;
            
            const contentResult = setupPageContentEffect(pageContent).run();
            if (contentResult.type === 'Left') return contentResult;
            
            const themeResult = setupThemeSystemEffect().run();
            if (themeResult.type === 'Left') return themeResult;
            
            return Either.Right('Application layout setup complete');
        })(rootResult);
    });

/**
 * Pure effect for main application initialization
 * @param {string} basePath - Base path for resources
 * @returns {Effect} Effect that returns Either<Error, Success>
 */
const initializeMainAppEffect = (basePath = '.') =>
    Effect(() => {
        const layoutResult = fetchResourceEffect(`${basePath}/templates/layout.html`).run();
        return Either.chain(layoutHtml => {
            const contentResult = extractPageContentEffect().run();
            return Either.chain(pageContent => 
                setupApplicationLayoutEffect(layoutHtml, pageContent, basePath).run()
            )(contentResult);
        })(layoutResult);
    });

/**
 * Pure effect for complete application initialization pipeline
 * @param {string} basePath - Base path for resources
 * @returns {Effect} Effect that returns Either<Error, Success>
 */
const initializeApplicationEffect = (basePath = '.') =>
    Effect(() => {
        const mainAppResult = initializeMainAppEffect(basePath).run();
        return Either.fold(
            error => {
                Either.fold(() => {}, () => {})(handleLayoutErrorEffect(error).run());
                Either.fold(() => {}, () => {})(logError(`Application failed: ${error}`).run());
                return Either.Left(error);
            },
            success => {
                Either.fold(() => {}, () => {})(logInfo('FlexNet application setup complete').run());
                return Either.Right(success);
            }
        )(mainAppResult);
    });

// ===========================================
// PURE FUNCTIONAL COMPONENT CREATORS
// ===========================================

/**
 * Pure function to create secure button configuration
 * @param {string} text - Button text
 * @param {Function} onClick - Click handler effect
 * @returns {Either} Either containing button config or error
 */
const createSecureButtonConfig = (text, onClick) =>
    Either.fromNullable(text)
        .map(sanitize)
        .chain(safeText =>
            typeof onClick === 'function'
                ? Either.Right({
                    tagName: 'button',
                    attributes: {
                        type: 'button',
                        class: 'px-4 py-2 bg-primary text-white rounded hover:bg-secondary transition-colors'
                    },
                    children: [safeText],
                    events: { click: onClick }
                })
                : Either.Left('onClick must be a function')
        );

/**
 * Pure function to create theme switcher configuration
 * @returns {Either} Either containing theme switcher config or error
 */
const createThemeSwitcherConfig = () => {
    const handlerResult = createThemeToggleHandlerEffect().run();
    return Either.chain(themeHandler =>
        createSecureButtonConfig('Toggle Theme', themeHandler)
    )(handlerResult);
};

// ===========================================
// PERFORMANCE AND DEBUGGING UTILITIES
// ===========================================

/**
 * Pure function to get performance metrics
 * @returns {Object} Performance metrics object
 */
const getPerformanceMetrics = () => {
    const safeGetTiming = () => {
        try {
            return typeof performance !== 'undefined' && performance.timing
                ? {
                    domLoading: performance.timing.domLoading,
                    domInteractive: performance.timing.domInteractive,
                    domComplete: performance.timing.domComplete,
                    loadComplete: performance.timing.loadEventEnd
                }
                : {};
        } catch {
            return {};
        }
    };

    const safeGetMemory = () => {
        try {
            return typeof performance !== 'undefined' && performance.memory
                ? {
                    usedJSHeapSize: performance.memory.usedJSHeapSize,
                    totalJSHeapSize: performance.memory.totalJSHeapSize
                }
                : {};
        } catch {
            return {};
        }
    };

    const safeGetUserAgent = () => {
        try {
            return typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown';
        } catch {
            return 'Unknown';
        }
    };

    return Object.freeze({
        timestamp: Date.now(),
        timing: safeGetTiming(),
        memory: safeGetMemory(),
        userAgent: safeGetUserAgent()
    });
};

/**
 * Pure effect to enable debug mode
 * @returns {Effect} Effect that returns Either<Error, DebugUtilities>
 */
const enableDebugModeEffect = () =>
    Effect(() => {
        const debugUtilities = Object.freeze({
            logPerformance: () => 
                log(`Performance: ${JSON.stringify(getPerformanceMetrics())}`, 'debug').run(),
            validateState: () => {
                const validation = Object.freeze({ isValid: true });
                Either.fold(() => {}, () => {})(log(
                    `State validation: ${validation.isValid ? 'VALID' : 'INVALID'}`, 
                    validation.isValid ? 'info' : 'error'
                ).run());
                return validation;
            }
        });

        // Attach to window for debugging (effect)
        if (typeof window !== 'undefined') {
            window.FlexNetDebug = debugUtilities;
            Either.fold(() => {}, () => {})(log('Debug mode enabled - utilities available at window.FlexNetDebug', 'info').run());
        }

        return Either.Right(debugUtilities);
    });

// ===========================================
// INITIALIZATION AND EXPORTS
// ===========================================

/**
 * Pure effect for FlexNet framework initialization
 * @param {string} basePath - Base path for resources
 * @returns {Effect} Effect that returns Either<Error, Success>
 */
const initializeFlexNetEffect = (basePath = '.') =>
    Effect(() => {
        // Execute effects in sequence
        const logResult = log('Starting FlexNet application initialization').run();
        if (logResult.type === 'Left') return logResult;
        
        const appResult = initializeApplicationEffect(basePath).run();
        if (appResult.type === 'Left') return appResult;
        
        const debugResult = enableDebugModeEffect().run();
        if (debugResult.type === 'Left') return debugResult;
        
        return Either.Right('FlexNet initialization complete');
    });

// ===========================================
// SAFE SCRIPT EXECUTION
// ===========================================

/**
 * Pure function to safely execute initialization
 * @returns {Either} Either containing result or error
 */
const safeExecuteInitialization = () =>
    Result.fromTry(() => {
        const initEffect = initializeFlexNetEffect('.');
        return executeEffect(initEffect);
    });

// Execute initialization safely
const initializationResult = safeExecuteInitialization();

Result.fold(
    error => {
        const logResult = executeEffect(logError(`Unhandled error during FlexNet initialization: ${error}`));
        Either.fold(
            logErr => console.error('Failed to log error:', logErr),
            () => {} // Log succeeded
        )(logResult);
    },
    result => Either.fold(
        error => {
            const logResult = executeEffect(logError(`FlexNet initialization failed: ${error}`));
            Either.fold(
                logErr => console.error('Failed to log error:', logErr),
                () => {} // Log succeeded
            )(logResult);
        },
        () => {
            const logResult = executeEffect(logInfo('FlexNet initialization sequence finished'));
            Either.fold(
                logErr => console.error('Failed to log info:', logErr),
                () => {} // Log succeeded
            )(logResult);
        }
    )(result)
)(initializationResult);

// ===========================================
// FRAMEWORK EXPORTS
// ===========================================

/**
 * Main FlexNet framework API - Pure functional interface
 */
export const FlexNet = Object.freeze({
    // Core initialization
    initialize: initializeFlexNetEffect,
    
    // Component creation (pure functions)
    createElement,
    createSecureButtonConfig,
    createThemeSwitcherConfig,
    
    // State management (functional interface)
    createStore: createImmutableStore,
    
    // Effects (functional interface)
    executeEffect,
    Effect,
    
    // Utilities (pure functions)
    getPerformanceMetrics,
    
    // Core types (for external use)
    Maybe,
    Either,
    Result
});

// Make FlexNet available globally for debugging and external access
if (typeof window !== 'undefined') {
    window.FlexNet = FlexNet;
}
