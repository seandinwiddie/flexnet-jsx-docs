// === Application Event Bus ===
// Central event coordination for the FlexNet docs app

import { createEventBus } from './functions/eventBus.js';
import { createSimpleEmitter } from './emitter/factories.js';

// ===========================================
// EVENT TYPES
// ===========================================

export const APP_EVENTS = Object.freeze({
    // Theme Events
    THEME_CHANGE_REQUESTED: 'theme:change-requested',
    THEME_CHANGED: 'theme:changed',
    
    // Sidebar Events
    SIDEBAR_TOGGLE_REQUESTED: 'sidebar:toggle-requested',
    SIDEBAR_OPENED: 'sidebar:opened',
    SIDEBAR_CLOSED: 'sidebar:closed',
    SIDEBAR_SECTION_CLICKED: 'sidebar:section-clicked',
    
    // Navigation Events
    NAVIGATION_STARTED: 'navigation:started',
    NAVIGATION_COMPLETED: 'navigation:completed',
    BREADCRUMB_UPDATE: 'navigation:breadcrumb-update',
    
    // UI Component Events
    COMPONENT_INITIALIZED: 'ui:component-initialized',
    COMPONENT_ERROR: 'ui:component-error',
    COPY_ACTION: 'ui:copy-action',
    
    // App Lifecycle Events
    APP_READY: 'app:ready',
    APP_ERROR: 'app:error'
});

// ===========================================
// CENTRAL EVENT BUS INSTANCE
// ===========================================

// Create the main application event bus
export const appEventBus = createEventBus();

// Add logging middleware for debugging
appEventBus.use((event) => {
    if (window.DEBUG_EVENTS) {
        console.log(`[Event Bus] ${event.type}:`, event.data);
    }
    return event;
});

// ===========================================
// EVENT COORDINATION HELPERS
// ===========================================

// Theme coordination
export const emitThemeChangeRequest = (newTheme) => {
    appEventBus.emit(APP_EVENTS.THEME_CHANGE_REQUESTED, { theme: newTheme, timestamp: Date.now() });
};

export const emitThemeChanged = (theme) => {
    appEventBus.emit(APP_EVENTS.THEME_CHANGED, { theme, timestamp: Date.now() });
};

// Sidebar coordination
export const emitSidebarToggleRequest = () => {
    appEventBus.emit(APP_EVENTS.SIDEBAR_TOGGLE_REQUESTED, { timestamp: Date.now() });
};

export const emitSidebarOpened = () => {
    appEventBus.emit(APP_EVENTS.SIDEBAR_OPENED, { timestamp: Date.now() });
};

export const emitSidebarClosed = () => {
    appEventBus.emit(APP_EVENTS.SIDEBAR_CLOSED, { timestamp: Date.now() });
};

export const emitSidebarSectionClicked = (sectionId, isExpanded) => {
    appEventBus.emit(APP_EVENTS.SIDEBAR_SECTION_CLICKED, { 
        sectionId, 
        isExpanded, 
        timestamp: Date.now() 
    });
};

// Navigation coordination
export const emitNavigationStarted = (path) => {
    appEventBus.emit(APP_EVENTS.NAVIGATION_STARTED, { path, timestamp: Date.now() });
};

export const emitNavigationCompleted = (path) => {
    appEventBus.emit(APP_EVENTS.NAVIGATION_COMPLETED, { path, timestamp: Date.now() });
};

// Component coordination
export const emitComponentInitialized = (componentName, element) => {
    appEventBus.emit(APP_EVENTS.COMPONENT_INITIALIZED, { 
        componentName, 
        element: element?.tagName, 
        timestamp: Date.now() 
    });
};

export const emitComponentError = (componentName, error) => {
    appEventBus.emit(APP_EVENTS.COMPONENT_ERROR, { 
        componentName, 
        error: error.message, 
        timestamp: Date.now() 
    });
};

export const emitCopyAction = (content, success = true) => {
    appEventBus.emit(APP_EVENTS.COPY_ACTION, { 
        contentLength: content?.length || 0, 
        success, 
        timestamp: Date.now() 
    });
};

// ===========================================
// CONVENIENCE SUBSCRIPTIONS
// ===========================================

// Subscribe to theme changes
export const onThemeChange = (callback) => {
    return appEventBus.on(APP_EVENTS.THEME_CHANGED, callback);
};

// Subscribe to sidebar events
export const onSidebarStateChange = (callback) => {
    appEventBus.on(APP_EVENTS.SIDEBAR_OPENED, () => callback('opened'));
    appEventBus.on(APP_EVENTS.SIDEBAR_CLOSED, () => callback('closed'));
};

// Subscribe to component events
export const onComponentInitialized = (callback) => {
    return appEventBus.on(APP_EVENTS.COMPONENT_INITIALIZED, callback);
};

// Subscribe to navigation events
export const onNavigationChange = (callback) => {
    return appEventBus.on(APP_EVENTS.NAVIGATION_COMPLETED, callback);
};

// ===========================================
// DEBUG UTILITIES
// ===========================================

// Enable event debugging
export const enableEventDebugging = () => {
    window.DEBUG_EVENTS = true;
    console.log('[Event Bus] Event debugging enabled');
};

// Get event statistics
export const getEventStats = () => {
    return appEventBus.getStats ? appEventBus.getStats() : null;
};

// Export the bus for direct access if needed
export default appEventBus; 