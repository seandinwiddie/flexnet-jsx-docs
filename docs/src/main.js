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
    delay,
    addListener,
    logInfo,
    logError,
    logWarn,
    getFromStorage,
    setToStorage,
    addClass,
    removeClass,
    sequence,
    parallel,
    EffectUtils
} from './systems/effects/functions.js';
import { setupUI } from './features/ui-setup/index.js';

// Pure function to create error display HTML
const createErrorHTML = (error) => 
    `<div style="color: red; padding: 2rem; font-family: monospace;">
        <h1>Critical Error</h1>
        <p>Could not load page layout. Please check the console for more details.</p>
        <p><strong>Error:</strong> ${escape(error.message)}</p>
    </div>`;

// Pure function to get initial page content
const getInitialPageContent = () => {
    const pageContentResult = query('#page-content');
    
    if (pageContentResult.type === 'Left') {
        return Either.Right('<h1>Welcome to FlexNet JSX</h1><p>Your documentation, powered by functional programming.</p>');
    }

    return pageContentResult.chain(maybeElement => {
        if (maybeElement.type === 'Just') {
            return Either.Right(maybeElement.value.innerHTML);
        }
        return Either.Right('<h1>Welcome to FlexNet JSX</h1><p>Your documentation, powered by functional programming.</p>');
    });
};

// Pure function to get container element
const getContainerElement = () => {
    const rootResult = query('#root');
    
    if (rootResult.type === 'Right' && rootResult.value.type === 'Just') {
        return Either.Right(rootResult.value.value);
    }

    const bodyResult = query('body');
    if (bodyResult.type === 'Right' && bodyResult.value.type === 'Just') {
        return Either.Right(bodyResult.value.value);
    }

    return Either.Left(new Error('CRITICAL: No container element found (#root or body).'));
};

// Pure function to setup theme switcher
const setupThemeSwitcher = () => {
    const themeToggleResult = query('#theme-toggle');
    
    if (themeToggleResult.type === 'Left') {
        return logWarn("[UI Setup] Theme toggle button #theme-toggle not found after component loading!");
    }

    return themeToggleResult.chain(maybeButton => {
        if (maybeButton.type === 'Nothing') {
            return logWarn("[UI Setup] Theme toggle button #theme-toggle not found after component loading!");
        }

        const button = maybeButton.value;
        
        // Theme toggle handler - pure function
        const themeToggleHandler = () => {
            const htmlResult = query('html');
            
            if (htmlResult.type === 'Right' && htmlResult.value.type === 'Just') {
                const htmlElement = htmlResult.value.value;
                const isDark = htmlElement.classList.contains('dark');
                
                if (isDark) {
                    removeClass('dark')(htmlElement);
                    setToStorage('theme', 'light');
                } else {
                    addClass('dark')(htmlElement);
                    setToStorage('theme', 'dark');
                }
            }
        };

        const listenerResult = addListener('click', themeToggleHandler)(button);
        
        if (listenerResult.type === 'Right') {
            return logInfo("[UI Setup] Theme switcher successfully initialized.");
        }
        
        return Either.Left("Failed to setup theme switcher");
    });
};

// Pure function to load all template components
const loadTemplateComponents = (basePath) => {
    const headerComponent = loadComponent('header-placeholder', `${basePath}/templates/header.html`);
    const sidebarComponent = loadComponent('sidebar-placeholder', `${basePath}/templates/sidebar.html`);
    const footerComponent = loadComponent('footer-placeholder', `${basePath}/templates/footer.html`);

    return Promise.all([headerComponent, sidebarComponent, footerComponent])
        .then(results => {
            // Log any component loading warnings
            results.forEach((result, index) => {
                const componentNames = ['header', 'sidebar', 'footer'];
                if (result.type === 'Left') {
                    logWarn(`Failed to load ${componentNames[index]}:`, result.value);
                }
            });
            return Either.Right(results);
        })
        .catch(error => Either.Left(error));
};

// Pure function to setup content placeholder
const setupContentPlaceholder = (pageContent) => {
    const contentPlaceholderResult = query('#content-placeholder');
    
    if (contentPlaceholderResult.type === 'Left') {
        return contentPlaceholderResult;
    }

    return contentPlaceholderResult.chain(maybePlaceholder => {
        if (maybePlaceholder.type === 'Just') {
            const element = maybePlaceholder.value;
            const htmlResult = safeSetHTML(pageContent)(element);
            
            if (htmlResult.type === 'Right') {
                // Make content visible
                element.style.display = 'block';
                return Either.Right(element);
            }
            return htmlResult;
        } else {
            // Fallback: try to set content in the main element
            logWarn("Content placeholder element #content-placeholder not found!");
            
            const mainElementResult = query('main');
            if (mainElementResult.type === 'Right' && mainElementResult.value.type === 'Just') {
                const mainElement = mainElementResult.value.value;
                return safeSetHTML(`<div class="max-w-7xl mx-auto">${pageContent}</div>`)(mainElement);
            }
            
            return Either.Left(new Error('No content placeholder or main element found'));
        }
    });
};

// Main application logic - pure functional composition
const initializeApplication = async () => {
    try {
        logInfo("Main function started. Preparing to fetch layout.");
        
        // Get initial page content
        const pageContentResult = getInitialPageContent();
        if (pageContentResult.type === 'Left') {
            return Either.Left(pageContentResult.value);
        }
        const pageContent = pageContentResult.value;
        
        // Get base path and layout URL
        const basePath = getBasePath();
        const layoutUrl = `${basePath}/templates/layout.html`;
        logInfo(`Fetching layout from: ${layoutUrl}`);

        // Fetch layout
        const layoutResult = await fetchResource(layoutUrl);
        if (layoutResult.type === 'Left') {
            logError("Failed to load layout:", layoutResult.value);
            
            // Handle error by showing error message
            const rootResult = query('#root');
            if (rootResult.type === 'Right' && rootResult.value.type === 'Just') {
                safeSetHTML(createErrorHTML(layoutResult.value))(rootResult.value.value);
            }
            return Either.Left(layoutResult.value);
        }

        const layoutHtml = layoutResult.value;

        // Get container element
        const containerResult = getContainerElement();
        if (containerResult.type === 'Left') {
            logError(containerResult.value.message);
            return containerResult;
        }
        const containerElement = containerResult.value;

        // Set layout HTML
        const layoutSetResult = safeSetHTML(layoutHtml)(containerElement);
        if (layoutSetResult.type === 'Left') {
            return Either.Left(new Error(`Failed to set layout HTML: ${layoutSetResult.value}`));
        }

        // Load template components in parallel
        const componentsResult = await loadTemplateComponents(basePath);
        if (componentsResult.type === 'Left') {
            logWarn('Some template components failed to load:', componentsResult.value);
        }

        // Setup content placeholder
        const contentResult = setupContentPlaceholder(pageContent);
        if (contentResult.type === 'Left') {
            logWarn('Failed to setup content placeholder:', contentResult.value);
        }

        // Wait for DOM to settle
        await delay(100);

        // Setup UI
        const uiResults = await setupUI(basePath);
        
        // Setup theme switcher
        const themeResult = setupThemeSwitcher();
        if (themeResult.type === 'Left') {
            logWarn('Failed to setup theme switcher:', themeResult.value);
        }

        logInfo('Application initialized successfully');
        return Either.Right({
            layout: layoutSetResult.value,
            components: componentsResult.value,
            content: contentResult.value,
            ui: uiResults,
            theme: themeResult.value
        });

    } catch (error) {
        logError('Application initialization failed:', error);
        return Either.Left(error);
    }
};

// Application entry point with proper effect isolation
const main = () => {
    const domContentLoadedHandler = () => {
        initializeApplication()
            .then(result => {
                if (result.type === 'Left') {
                    logError('Application initialization failed:', result.value);
                } else {
                    logInfo('Application initialized successfully');
                }
            })
            .catch(error => {
                logError("A critical error occurred during site initialization:", error);
            });
    };

    // Setup DOM content loaded listener using effect system
    if (document.readyState === 'loading') {
        addListener('DOMContentLoaded', domContentLoadedHandler)(document);
    } else {
        // DOM already loaded
        domContentLoadedHandler();
    }
};

// Initialize application
main();
