// === FlexNet JSX Docs Application Entry Point ===
// Main application orchestrator following FlexNet architecture principles
// Pure functional initialization with effect composition

import Maybe from './core/types/maybe.js';
import Either from './core/types/either.js';
import Result from './core/types/result.js';
import { pipe, compose } from './core/functions/composition.js';
import { getBasePath } from './core/functions/transforms.js';
import { sanitize, escape } from './security/functions.js';
import { 
    query, 
    fetchResource, 
    safeSetHTML, 
    loadComponent,
    setHTML,
    addClass,
    removeClass,
    setStyle,
    addEventListener,
    setLocalStorage,
    getLocalStorage,
    createDOMReadyEffect,
    hasClass,
    log,
    delay,
    chainEffects,
    executeEffect
} from './systems/effects/functions.js';
import { initializeUI } from './systems/render/functions.js';
import { FlexNetStore } from './systems/state/store.js';
import { createElement } from './core/runtime/factory.js';

// ===========================================
// PURE FUNCTIONAL APPLICATION INITIALIZATION
// ===========================================

/**
 * Pure function to extract page content
 * @returns {string} The page content HTML
 */
const extractPageContent = () =>
    pipe(
        Maybe.fromNullable,
        Maybe.map(element => element.innerHTML),
        Maybe.getOrElse('')
    )(document.getElementById('page-content'));

/**
 * Pure function to create error HTML
 * @param {string} error - Error message
 * @returns {string} Sanitized error HTML
 */
const createErrorHTML = (error) => `
    <div style="color: red; padding: 2rem; font-family: monospace;">
        <h1>Critical Error</h1>
        <p>Could not load page layout. Please check the console for more details.</p>
        <p><strong>Error:</strong> ${sanitize(error.message || error)}</p>
    </div>
`;

/**
 * Pure function to handle layout errors
 * @param {Error} error - The error that occurred
 * @returns {Promise<Either>} Either containing the result
 */
const handleLayoutError = (error) => 
    Result.fromTry(() => {
        const errorHtml = createErrorHTML(error);
        
        return query('#root')
            .map(rootElement => 
                pipe(
                    () => executeEffect(log('Rendering error to root element')),
                    () => safeSetHTML(errorHtml)(rootElement)
                )()
            )
            .getOrElse(() => 
                pipe(
                    () => executeEffect(log('No root element found, using body')),
                    () => safeSetHTML(errorHtml)(document.body)
                )()
            );
    });

/**
 * Pure function to create component loading effects
 * @param {string} basePath - Base path for resources
 * @returns {Array<Promise>} Array of component loading promises
 */
const createComponentLoadingEffects = (basePath) => [
    loadComponent('header-placeholder', `${basePath}/templates/header.html`),
    loadComponent('sidebar-placeholder', `${basePath}/templates/sidebar.html`),
    loadComponent('footer-placeholder', `${basePath}/templates/footer.html`)
];

/**
 * Pure function to process component results
 * @param {Array} componentResults - Results from component loading
 * @returns {Promise} Promise that resolves when processing is complete
 */
const processComponentResults = (componentResults) =>
    Promise.all(
        componentResults.map(result =>
            result.type === 'Error'
                ? executeEffect(log(`Component load warning: ${result.error}`, 'warn'))
                : Result.Ok(result)
        )
    );

/**
 * Pure function to setup page content
 * @param {string} pageContent - The page content HTML
 * @returns {Promise<Either>} Either containing the result
 */
const setupPageContent = async (pageContent) => {
    const setupContentPlaceholder = (element) =>
        chainEffects(
            setHTML(element, pageContent),
            setStyle(element, 'display', 'block')
        );

    const setupMainElement = (element) => {
        const wrappedContent = `<div class="max-w-7xl mx-auto">${pageContent}</div>`;
        return executeEffect(setHTML(element, wrappedContent));
    };

    const placeholderMaybe = await executeEffect(query('#content-placeholder'));
    
    return Maybe.fold(
        async () => {
            await executeEffect(log('Content placeholder not found, trying main element', 'warn'));
            const mainMaybe = await executeEffect(query('main'));
            return Maybe.fold(
                () => Promise.resolve(),
                setupMainElement
            )(mainMaybe);
        },
        setupContentPlaceholder
    )(placeholderMaybe);
};

/**
 * Pure function to create theme toggle handler
 * @returns {Function} Theme toggle handler function
 */
const createThemeToggleHandler = () => async () => {
    const html = document.documentElement;
    const isDarkResult = await executeEffect(hasClass(html, 'dark'));
    
    return Maybe.fold(
        () => false,
        (hasClass) => hasClass
    )(isDarkResult).then(isDark => {
        const themeEffects = isDark
            ? [
                removeClass(html, 'dark'),
                setLocalStorage('theme', 'light')
            ]
            : [
                addClass(html, 'dark'),
                setLocalStorage('theme', 'dark')
            ];
        
        return chainEffects(...themeEffects);
    });
};

/**
 * Pure function to setup theme system
 * @returns {Promise<Either>} Either containing the result
 */
const setupThemeSystem = () => {
    const themeToggleHandler = createThemeToggleHandler();
    
    return pipe(
        Maybe.fromNullable,
        Maybe.fold(
            () => executeEffect(log('Theme toggle button not found after component loading', 'warn')),
            (button) => chainEffects(
                addEventListener(button, 'click', themeToggleHandler),
                log('Theme switcher successfully initialized', 'info')
            )
        )
    )(document.getElementById('theme-toggle'));
};

/**
 * Pure function to setup application layout
 * @param {string} layoutHtml - Layout HTML content
 * @param {string} pageContent - Page content HTML
 * @param {string} basePath - Base path for resources
 * @returns {Promise<Either>} Result containing the setup outcome
 */
const setupApplicationLayout = async (layoutHtml, pageContent, basePath) => {
    const containerElement = pipe(
        Maybe.fromNullable,
        Maybe.getOrElse(document.body)
    )(document.getElementById('root'));

    // Use effect composition for DOM manipulation
    await executeEffect(setHTML(containerElement, layoutHtml));
    
    // Load components using effect composition
    const componentEffects = createComponentLoadingEffects(basePath);
    const componentResults = await Promise.all(componentEffects);
    
    await processComponentResults(componentResults);

    await setupPageContent(pageContent);

    // Setup theme system after components are loaded
    await setupThemeSystem();
};

/**
 * Main application initialization function
 * @param {string} basePath - Base path for resources
 * @returns {Promise<Result>} A promise that resolves with the outcome
 */
const initializeMainApp = async (basePath = '.') => {
    const layoutResult = await executeEffect(fetchResource(`${basePath}/templates/layout.html`));

    return Either.fold(
        error => {
            handleLayoutError(error);
            return Result.Error(error);
        },
        async (layoutHtml) => {
            const pageContent = extractPageContent();
            await setupApplicationLayout(layoutHtml, pageContent, basePath);
            return Result.Ok('Application initialized successfully');
        }
    )(layoutResult);
};

/**
 * Pure functional application initialization pipeline
 * @returns {Promise<Result>} A promise that resolves with the final outcome
 */
const initializeApplication = () =>
    pipe(
        initializeMainApp,
        (appPromise) => appPromise.then(res => 
            Result.fold(
                error => executeEffect(log(`Application failed: ${error}`, 'error')),
                () => executeEffect(log('FlexNet application setup complete', 'info'))
            )(res)
        )
    )('.');

// ===========================================
// PURE FUNCTIONAL COMPONENT CREATORS
// ===========================================

/**
 * Creates a secure button component using pure functions
 * @param {string} text - Button text
 * @param {Function} onClick - Click handler
 * @returns {Object} Button element configuration
 */
const createSecureButton = (text, onClick) => {
    const safeText = sanitize(text);
    
    const buttonConfig = {
        tagName: 'button',
        attributes: {
            type: 'button',
            class: 'px-4 py-2 bg-primary text-white rounded hover:bg-secondary transition-colors'
        },
        children: [safeText],
        events: {
            click: onClick
        }
    };
    
    return createElement(buttonConfig);
};

/**
 * Creates a theme switcher component
 * @returns {Object} Theme switcher element configuration
 */
const createThemeSwitcher = () => {
    const handleClick = createThemeToggleHandler();
    
    return createSecureButton('Toggle Theme', handleClick);
};

// ===========================================
// PERFORMANCE AND DEBUGGING UTILITIES
// ===========================================

/**
 * Enables debug mode with functional logging
 * @returns {Object} Debug utilities
 */
const enableDebugMode = () => {
    const debugUtilities = {
        logState: () => executeEffect(log(`Current state: ${JSON.stringify(FlexNetStore.getState())}`, 'debug')),
        logPerformance: () => executeEffect(log(`Performance: ${JSON.stringify(getPerformanceMetrics())}`, 'debug')),
        validateState: () => {
            const validation = { isValid: true }; // Simplified validation
            executeEffect(log(`State validation: ${validation.isValid ? 'VALID' : 'INVALID'}`, validation.isValid ? 'info' : 'error'));
            return validation;
        }
    };
    
    // Attach to window for debugging (effect)
    if (typeof window !== 'undefined') {
        window.FlexNetDebug = debugUtilities;
        executeEffect(log('Debug mode enabled - utilities available at window.FlexNetDebug', 'info'));
    }
    
    return debugUtilities;
};

/**
 * Pure function to get performance metrics
 * @returns {Object} Performance metrics object
 */
const getPerformanceMetrics = () => {
    const getNavigationTiming = () => 
        typeof performance !== 'undefined' && performance.navigation
            ? {
                domLoading: performance.timing.domLoading,
                domInteractive: performance.timing.domInteractive,
                domComplete: performance.timing.domComplete,
                loadComplete: performance.timing.loadEventEnd
              }
            : {};
    
    const getMemoryInfo = () =>
        typeof performance !== 'undefined' && performance.memory
            ? {
                usedJSHeapSize: performance.memory.usedJSHeapSize,
                totalJSHeapSize: performance.memory.totalJSHeapSize
              }
            : {};
    
    return {
        timestamp: Date.now(),
        timing: getNavigationTiming(),
        memory: getMemoryInfo(),
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown'
    };
};

// ===========================================
// INITIALIZATION AND EXPORTS
// ===========================================

/**
 * FlexNet framework initialization function
 * @param {string} basePath - Base path for resources
 * @returns {Promise<Either>} Initialization result
 */
const initializeFlexNet = (basePath = '.') =>
    pipe(
        () => executeEffect(log(`Starting FlexNet application initialization`)),
        () => initializeApplication(),
    )();

// ===========================================
// SCRIPT EXECUTION
// ===========================================

// Initialize the application with the correct base path
// The result is a promise that resolves when initialization is complete
const initializationPromise = initializeFlexNet('.');

initializationPromise.then(() => {
    console.log('[INFO] FlexNet initialization sequence finished.');
}).catch(err => {
    console.error('[CRITICAL] Unhandled error during FlexNet initialization:', err);
});

// ===========================================
// FRAMEWORK EXPORTS
// ===========================================

/**
 * Main FlexNet framework API
 * Pure functional interface following FlexNet architecture
 */
export const FlexNet = Object.freeze({
    // Core initialization
    initialize: initializeFlexNet,
    
    // Component creation (pure functions)
    createElement,
    createSecureButton,
    createThemeSwitcher,
    
    // State management (functional interface)
    store: FlexNetStore,
    
    // Effects (functional interface)
    executeEffect,
    
    // Security (pure functions)
    sanitize,
    
    // Utilities (pure functions)
    enableDebugMode,
    getPerformanceMetrics,
    
    // Application lifecycle
    initializeApplication
});

export default FlexNet;
