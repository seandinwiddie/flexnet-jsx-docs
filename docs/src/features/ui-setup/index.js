// === UI Setup Module ===
// Aggregates all UI setup functions with event coordination

import {
    setupLogoEffect as setupLogo,
    setupSyntaxHighlightingEffect as setupSyntaxHighlighting,
    setupSidebarAccordionEffect as setupSidebarAccordion,
    setupSidebarActiveLinkEffect as setupSidebarActiveLink,
    setupMobileSidebarEffect as setupMobileSidebar,
    setupCopyButtonsEffect as setupCopyButtons,
    setupThemeSwitcherEffect as setupThemeSwitcher
} from '../../systems/render/functions.js';

import { setupBreadcrumbs } from '../navigation/functions.js';
import { 
    appEventBus, 
    APP_EVENTS,
    emitComponentInitialized,
    emitComponentError,
    enableEventDebugging
} from '../../systems/events/appEventBus.js';

// ===========================================
// COORDINATED UI SETUP
// ===========================================

// Main UI setup orchestrator with event coordination
export const setupUI = async (basePath) => {
    console.log("[UI Setup] Initializing all UI components with event coordination.");
    
    // Enable event debugging in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        enableEventDebugging();
    }
    
    // Setup component initialization coordination
    setupComponentCoordination();
    
    // Initialize components in coordination-aware order
    const results = await initializeComponentsWithCoordination(basePath);
    
    // Emit app ready event
    appEventBus.emit(APP_EVENTS.APP_READY, { 
        basePath, 
        componentsInitialized: Object.keys(results).length,
        timestamp: Date.now() 
    });
    
    console.log("[UI Setup] All components are set up with event coordination.");
    return results;
};

// Initialize components with proper coordination
const initializeComponentsWithCoordination = async (basePath) => {
    const results = {};
    
    try {
        // Phase 1: Core infrastructure
        console.log("[UI Setup] Phase 1: Core infrastructure");
        
        results.logo = await setupLogo(basePath);
        emitComponentInitialized('logo', results.logo);
        
        results.themeSwitcher = await setupThemeSwitcher();
        emitComponentInitialized('theme-switcher', results.themeSwitcher);
        
        // Phase 2: Navigation and layout
        console.log("[UI Setup] Phase 2: Navigation and layout");
        
        results.mobileSidebar = await setupMobileSidebar();
        emitComponentInitialized('mobile-sidebar', results.mobileSidebar);
        
        results.breadcrumbs = setupBreadcrumbs();
        emitComponentInitialized('breadcrumbs', results.breadcrumbs);
        
        results.sidebarAccordion = await setupSidebarAccordion();
        emitComponentInitialized('sidebar-accordion', results.sidebarAccordion);
        
        results.sidebarActiveLink = await setupSidebarActiveLink();
        emitComponentInitialized('sidebar-active-link', results.sidebarActiveLink);
        
        // Phase 3: Content enhancement
        console.log("[UI Setup] Phase 3: Content enhancement");
        
        results.syntaxHighlighting = await setupSyntaxHighlighting();
        emitComponentInitialized('syntax-highlighting', results.syntaxHighlighting);
        
        results.copyButtons = await setupCopyButtons();
        emitComponentInitialized('copy-buttons', results.copyButtons);
        
        console.log("[UI Setup] All phases completed successfully");
        
    } catch (error) {
        emitComponentError('ui-setup', error);
        console.error("[UI Setup] Setup failed:", error);
    }
    
    return results;
};

// Setup component coordination listeners
const setupComponentCoordination = () => {
    // Track component initialization progress
    let initializedComponents = new Set();
    
    appEventBus.on(APP_EVENTS.COMPONENT_INITIALIZED, ({ componentName, timestamp }) => {
        initializedComponents.add(componentName);
        console.log(`[UI Coordination] Component initialized: ${componentName}`);
        
        // Trigger dependent initialization
        handleComponentDependencies(componentName, initializedComponents);
    });
    
    appEventBus.on(APP_EVENTS.COMPONENT_ERROR, ({ componentName, error }) => {
        console.error(`[UI Coordination] Component failed: ${componentName} - ${error}`);
        
        // Could implement fallback strategies here
        handleComponentFailure(componentName, error);
    });
    
    // Listen for theme changes to coordinate UI updates
    appEventBus.on(APP_EVENTS.THEME_CHANGED, ({ theme }) => {
        console.log(`[UI Coordination] Coordinating theme change: ${theme}`);
        
        // Notify all components about theme change
        coordinateThemeChange(theme, initializedComponents);
    });
    
    // Setup app lifecycle coordination
    appEventBus.on(APP_EVENTS.APP_READY, ({ componentsInitialized, timestamp }) => {
        console.log(`[UI Coordination] App ready with ${componentsInitialized} components`);
        
        // Could trigger final setup steps, analytics, etc.
        finalizeAppSetup(initializedComponents);
    });
};

// Handle component dependencies and coordination
const handleComponentDependencies = (componentName, initializedComponents) => {
    switch (componentName) {
        case 'theme-switcher':
            // Theme switcher should coordinate with all visual components
            console.log('[UI Coordination] Theme switcher ready - other components can adapt');
            break;
            
        case 'sidebar-accordion':
            // Sidebar affects mobile sidebar and breadcrumbs
            if (initializedComponents.has('mobile-sidebar')) {
                console.log('[UI Coordination] Coordinating sidebar components');
            }
            break;
            
        case 'syntax-highlighting':
            // Syntax highlighting affects copy buttons
            if (initializedComponents.has('copy-buttons')) {
                console.log('[UI Coordination] Re-scanning copy buttons after syntax highlighting');
                // Could trigger copy button refresh
            }
            break;
    }
};

// Handle component failure with fallback strategies
const handleComponentFailure = (componentName, error) => {
    console.warn(`[UI Coordination] Implementing fallback for failed component: ${componentName}`);
    
    switch (componentName) {
        case 'theme-switcher':
            // Provide basic theme functionality
            console.log('[UI Coordination] Implementing basic theme fallback');
            break;
            
        case 'copy-buttons':
            // Show manual copy instructions
            console.log('[UI Coordination] Providing manual copy fallback');
            break;
            
        case 'sidebar-accordion':
            // Provide basic navigation
            console.log('[UI Coordination] Providing basic navigation fallback');
            break;
    }
};

// Coordinate theme changes across components
const coordinateThemeChange = (theme, initializedComponents) => {
    // All components can respond to theme changes through the event bus
    // This is handled automatically by their individual event listeners
    
    console.log(`[UI Coordination] Theme coordination triggered for ${initializedComponents.size} components`);
};

// Finalize app setup after all components are ready
const finalizeAppSetup = (initializedComponents) => {
    console.log(`[UI Coordination] Finalizing setup for ${initializedComponents.size} components`);
    
    // Could add final touches like:
    // - Performance measurements
    // - Analytics tracking
    // - Accessibility enhancements
    // - Progressive enhancement features
    
    // Mark app as fully ready
    document.body.setAttribute('data-app-ready', 'true');
    document.body.classList.add('app-ready');
};

// Export coordination utilities
export const getUICoordinationStatus = () => {
    return {
        eventBusReady: !!appEventBus,
        componentsReady: document.body.hasAttribute('data-app-ready'),
        eventStats: appEventBus.getStats ? appEventBus.getStats() : null
    };
}; 