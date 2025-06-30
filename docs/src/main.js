// === FlexNet JSX Docs Application Entry Point ===
// Main application orchestrator following FlexNet architecture principles

import Maybe from './core/types/maybe.js';
import Result from './core/types/result.js';
import { pipe } from './core/functions/composition.js';
import { getBasePath } from './core/functions/transforms.js';
import { escape } from './security/functions.js';
import { query, fetchResource, safeSetHTML, loadComponent } from './systems/effects/functions.js';
import { setupUI } from './features/ui-setup/index.js';

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
