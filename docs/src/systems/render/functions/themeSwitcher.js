import { 
    executeEffect, 
    queryEffect,
    addClassEffect,
    removeClassEffect,
    addEventListenerEffect,
    getLocalStorageEffect,
    setLocalStorageEffect,
    logEffect,
    createAsyncEffect
} from '../../effects/functions.js';
import { createThemeSwitcherConfig } from './componentConfigs.js';
import { 
    appEventBus, 
    APP_EVENTS,
    emitThemeChangeRequest,
    emitThemeChanged,
    emitComponentInitialized,
    onThemeChange
} from '../../events/appEventBus.js';

// ===========================================
// THEME SWITCHER SETUP WITH EVENT COORDINATION
// ===========================================

// Pure theme switcher setup using effects and event bus
export const setupThemeSwitcherEffect = () =>
    createAsyncEffect(async () => {
        await executeEffect(logEffect('Initializing theme switcher with event coordination', 'info'));
        
        const config = createThemeSwitcherConfig();
        const toggleResult = await executeEffect(queryEffect(config.selector));
        
        if (toggleResult.type === 'Just') {
            const button = toggleResult.value;
            
            // Load saved theme
            const savedTheme = await executeEffect(getLocalStorageEffect(config.storageKey));
            const initialTheme = savedTheme || 'light';
            
            // Apply initial theme
            await applyTheme(initialTheme, config);
            
            // Emit initial theme state
            emitThemeChanged(initialTheme);
            
            // Set up event-driven theme handling
            await setupThemeEventHandlers(button, config);
            
            // Subscribe to external theme change requests
            setupThemeSubscriptions(config);
            
            emitComponentInitialized('theme-switcher', button);
            return button;
        } else {
            await executeEffect(logEffect('Theme toggle button not found', 'warn'));
            return null;
        }
    });

// Setup theme event handlers
const setupThemeEventHandlers = async (button, config) => {
    // Handle button clicks through event bus
    const clickHandler = async () => {
        const html = document.documentElement;
        const currentTheme = html.classList.contains(config.darkClass) ? 'dark' : 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Request theme change through event bus
        emitThemeChangeRequest(newTheme);
    };
    
    await executeEffect(addEventListenerEffect(button, 'click', clickHandler));
    
    // Listen for theme change requests and apply them
    appEventBus.on(APP_EVENTS.THEME_CHANGE_REQUESTED, async ({ theme }) => {
        await applyTheme(theme, config);
        await executeEffect(setLocalStorageEffect(config.storageKey, theme));
        emitThemeChanged(theme);
    });
};

// Setup theme subscriptions for external coordination
const setupThemeSubscriptions = (config) => {
    // Listen for theme changes to coordinate with other components
    onThemeChange(({ theme }) => {
        // Update button state or other UI elements if needed
        const button = document.querySelector(config.selector);
        if (button) {
            button.setAttribute('data-theme', theme);
            button.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
        }
        
        // Notify other systems about theme change
        console.log(`[Theme Switcher] Theme changed to: ${theme}`);
    });
    
    // Example: Listen for component initialization to apply theme
    appEventBus.on(APP_EVENTS.COMPONENT_INITIALIZED, ({ componentName }) => {
        if (componentName === 'sidebar' || componentName === 'copy-buttons') {
            // Reapply current theme to newly initialized components
            const currentTheme = document.documentElement.classList.contains(config.darkClass) ? 'dark' : 'light';
            emitThemeChanged(currentTheme);
        }
    });
};

// Apply theme with effects
const applyTheme = async (theme, config) => {
    const html = document.documentElement;
    
    if (theme === 'dark') {
        await executeEffect(addClassEffect(html, config.darkClass));
    } else {
        await executeEffect(removeClassEffect(html, config.darkClass));
    }
    
    await executeEffect(logEffect(`Theme applied: ${theme}`, 'info'));
};

// Export theme utilities for external use
export const getCurrentTheme = () => {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
};

export const setTheme = (theme) => {
    emitThemeChangeRequest(theme);
}; 