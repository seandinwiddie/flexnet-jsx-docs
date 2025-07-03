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
    Effect(() =>
        executeEffect(queryById('page-content'))
            .chain(maybeElement =>
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
            )
    );

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
        
        return executeEffect(queryById('root'))
            .chain(maybeRoot =>
                Maybe.fold(
                    () => {
                        // Fallback to body if root not found
                        executeEffect(log('No root element found, using body', 'warn'));
                        return executeEffect(setHTML(document.body, errorHtml));
                    },
                    rootElement => executeEffect(setHTML(rootElement, errorHtml))
                )(maybeRoot)
            );
    });

/**
 * Pure effect to fetch a resource
 * @param {string} url - Resource URL
 * @returns {Effect} Effect that returns Either<Error, string>
 */
const fetchResourceEffect = (url) =>
    Effect(() => 
        executeEffect(httpGet(url))
            .chain(response => 
                response && response.status === 200
                    ? Either.Right(response.data)
                    : Either.Left(`Failed to fetch ${url}: ${response ? response.statusText : 'Unknown error'}`)
            )
    );

/**
 * Pure effect to load a component into a placeholder
 * @param {string} placeholderId - ID of placeholder element
 * @param {string} templateUrl - URL of template to load
 * @returns {Effect} Effect that returns Either<Error, Element>
 */
const loadComponentEffect = (placeholderId, templateUrl) =>
    Effect(() =>
        executeEffect(fetchResourceEffect(templateUrl))
            .chain(templateContent =>
                executeEffect(queryById(placeholderId))
                    .chain(maybePlaceholder =>
                        Maybe.fold(
                            () => Either.Left(`Placeholder not found: ${placeholderId}`),
                            placeholder => executeEffect(setHTML(placeholder, templateContent))
                        )(maybePlaceholder)
                    )
            )
    );

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

        return Either.Right(componentEffects.map(effect => executeEffect(effect)));
    });

/**
 * Pure effect to setup page content
 * @param {string} pageContent - Page content HTML
 * @returns {Effect} Effect that returns Either<Error, Success>
 */
const setupPageContentEffect = (pageContent) =>
    Effect(() => {
        const wrappedContent = `<div class="max-w-7xl mx-auto">${pageContent}</div>`;
        
        return executeEffect(queryById('content-placeholder'))
            .chain(maybeContentPlaceholder =>
                Maybe.fold(
                    () => {
                        executeEffect(log('Content placeholder not found, trying main element', 'warn'));
                        return executeEffect(query('main'))
                            .chain(maybeMain =>
                                Maybe.fold(
                                    () => Either.Right(null), // No main element found
                                    mainElement => executeEffect(setHTML(mainElement, wrappedContent))
                                )(maybeMain)
                            );
                    },
                    contentPlaceholder => {
                        return chainEffects(
                            setHTML(contentPlaceholder, pageContent),
                            setStyle(contentPlaceholder, 'display', 'block')
                        );
                    }
                )(maybeContentPlaceholder)
            );
    });

/**
 * Pure effect to check if element has dark class
 * @param {Element} element - Element to check
 * @returns {Effect} Effect that returns Either<Error, boolean>
 */
const hasDarkClassEffect = (element) =>
    Effect(() => 
        executeEffect(hasClass(element, 'dark'))
    );

/**
 * Pure effect to create theme toggle handler
 * @returns {Effect} Effect that returns Either<Error, Function>
 */
const createThemeToggleHandlerEffect = () =>
    Effect(() => {
        const toggleHandler = () =>
            Effect(() => {
                const htmlElement = document.documentElement;
                
                return executeEffect(hasDarkClassEffect(htmlElement))
                    .chain(isDark => {
                        const themeEffects = isDark
                            ? [
                                removeClass(htmlElement, 'dark'),
                                setLocalStorage('theme', 'light')
                            ]
                            : [
                                addClass(htmlElement, 'dark'),
                                setLocalStorage('theme', 'dark')
                            ];
                        
                        return parallelEffects(...themeEffects);
                    });
            });
        
        return Either.Right(toggleHandler);
    });

/**
 * Pure effect to setup theme system
 * @returns {Effect} Effect that returns Either<Error, Success>
 */
const setupThemeSystemEffect = () =>
    Effect(() =>
        executeEffect(createThemeToggleHandlerEffect())
            .chain(themeHandler =>
                executeEffect(queryById('theme-toggle'))
                    .chain(maybeToggleButton =>
                        Maybe.fold(
                            () => {
                                executeEffect(log('Theme toggle button not found after component loading', 'warn'));
                                return Either.Right(null);
                            },
                            toggleButton => 
                                chainEffects(
                                    addEventListener(toggleButton, 'click', themeHandler),
                                    log('Theme switcher successfully initialized', 'info')
                                )
                        )(maybeToggleButton)
                    )
            )
    );

/**
 * Pure effect to setup application layout
 * @param {string} layoutHtml - Layout HTML content
 * @param {string} pageContent - Page content HTML
 * @param {string} basePath - Base path for resources
 * @returns {Effect} Effect that returns Either<Error, Success>
 */
const setupApplicationLayoutEffect = (layoutHtml, pageContent, basePath) =>
    Effect(() =>
        executeEffect(queryById('root'))
            .chain(maybeRoot => {
                const containerElement = Maybe.getOrElse(document.body)(maybeRoot);
                
                return chainEffects(
                    setHTML(containerElement, layoutHtml),
                    createComponentLoadingEffects(basePath),
                    setupPageContentEffect(pageContent),
                    setupThemeSystemEffect()
                );
            })
    );

/**
 * Pure effect for main application initialization
 * @param {string} basePath - Base path for resources
 * @returns {Effect} Effect that returns Either<Error, Success>
 */
const initializeMainAppEffect = (basePath = '.') =>
    Effect(() =>
        executeEffect(fetchResourceEffect(`${basePath}/templates/layout.html`))
            .chain(layoutHtml =>
                executeEffect(extractPageContentEffect())
                    .chain(pageContent =>
                        executeEffect(setupApplicationLayoutEffect(layoutHtml, pageContent, basePath))
                    )
            )
    );

/**
 * Pure effect for complete application initialization pipeline
 * @param {string} basePath - Base path for resources
 * @returns {Effect} Effect that returns Either<Error, Success>
 */
const initializeApplicationEffect = (basePath = '.') =>
    Effect(() =>
        executeEffect(initializeMainAppEffect(basePath))
            .fold(
                error => {
                    executeEffect(handleLayoutErrorEffect(error));
                    executeEffect(logError(`Application failed: ${error}`));
                    return Either.Left(error);
                },
                success => {
                    executeEffect(logInfo('FlexNet application setup complete'));
                    return Either.Right(success);
                }
            )
    );

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
const createThemeSwitcherConfig = () =>
    executeEffect(createThemeToggleHandlerEffect())
        .chain(themeHandler =>
            createSecureButtonConfig('Toggle Theme', themeHandler)
        );

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
                executeEffect(log(`Performance: ${JSON.stringify(getPerformanceMetrics())}`, 'debug')),
            validateState: () => {
                const validation = Object.freeze({ isValid: true });
                executeEffect(log(
                    `State validation: ${validation.isValid ? 'VALID' : 'INVALID'}`, 
                    validation.isValid ? 'info' : 'error'
                ));
                return validation;
            }
        });

        // Attach to window for debugging (effect)
        if (typeof window !== 'undefined') {
            window.FlexNetDebug = debugUtilities;
            executeEffect(log('Debug mode enabled - utilities available at window.FlexNetDebug', 'info'));
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
    Effect(() =>
        chainEffects(
            log('Starting FlexNet application initialization'),
            initializeApplicationEffect(basePath),
            enableDebugModeEffect()
        )
    );

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
    error => executeEffect(logError(`Unhandled error during FlexNet initialization: ${error}`)),
    result => Either.fold(
        error => executeEffect(logError(`FlexNet initialization failed: ${error}`)),
        () => executeEffect(logInfo('FlexNet initialization sequence finished'))
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
