import { 
    executeEffect, 
    queryAllEffect,
    addEventListenerEffect,
    setTextContentEffect,
    setTimeoutEffect,
    logEffect,
    createAsyncEffect
} from '../../effects/functions.js';
import { 
    appEventBus, 
    APP_EVENTS,
    emitCopyAction,
    emitComponentInitialized,
    emitComponentError,
    onThemeChange
} from '../../events/appEventBus.js';

// ===========================================
// COPY BUTTONS SETUP WITH EVENT COORDINATION
// ===========================================

// Pure copy buttons setup using effects and event bus
export const setupCopyButtonsEffect = () =>
    createAsyncEffect(async () => {
        await executeEffect(logEffect('Initializing copy buttons with event coordination', 'info'));
        
        try {
            const preElementsResult = await executeEffect(queryAllEffect('pre'));
            const setupButtons = [];
            
            for (const pre of preElementsResult) {
                const parent = pre.parentElement;
                const button = parent ? parent.querySelector('button') : null;
                
                if (button) {
                    await setupCopyButtonWithEvents(button, pre);
                    setupButtons.push(button);
                }
            }
            
            // Setup event coordination for copy actions
            setupCopyEventCoordination();
            
            emitComponentInitialized('copy-buttons', null);
            await executeEffect(logEffect(`Copy buttons setup complete: ${setupButtons.length} buttons`, 'info'));
            
            return setupButtons;
            
        } catch (error) {
            emitComponentError('copy-buttons', error);
            await executeEffect(logEffect(`Copy buttons setup failed: ${error.message}`, 'error'));
            return [];
        }
    });

// Setup individual copy button with event coordination
const setupCopyButtonWithEvents = async (button, pre) => {
    // Store original button text
    const originalText = button.textContent || 'Copy';
    button.setAttribute('data-original-text', originalText);
    
    const clickHandler = async () => {
        try {
            const textToCopy = pre.innerText;
            
            // Attempt to copy to clipboard
            await navigator.clipboard.writeText(textToCopy);
            
            // Emit successful copy event
            emitCopyAction(textToCopy, true);
            
            // Update button state
            await showCopySuccess(button, originalText);
            
        } catch (error) {
            // Emit failed copy event
            emitCopyAction(pre.innerText, false);
            
            // Show error state
            await showCopyError(button, originalText, error);
            
            await executeEffect(logEffect('Failed to copy text to clipboard', 'error'));
        }
    };
    
    await executeEffect(addEventListenerEffect(button, 'click', clickHandler));
};

// Show copy success state
const showCopySuccess = async (button, originalText) => {
    await executeEffect(setTextContentEffect(button, '✓ Copied!'));
    button.classList.add('copy-success');
    
    // Reset after delay
    await executeEffect(setTimeoutEffect(async () => {
        await executeEffect(setTextContentEffect(button, originalText));
        button.classList.remove('copy-success');
    }, 2000));
};

// Show copy error state
const showCopyError = async (button, originalText, error) => {
    await executeEffect(setTextContentEffect(button, '✗ Failed'));
    button.classList.add('copy-error');
    
    // Reset after delay
    await executeEffect(setTimeoutEffect(async () => {
        await executeEffect(setTextContentEffect(button, originalText));
        button.classList.remove('copy-error');
    }, 3000));
};

// Setup event coordination for copy actions
const setupCopyEventCoordination = () => {
    // Track copy statistics
    let copyStats = { total: 0, successful: 0, failed: 0 };
    
    // Listen to copy actions for analytics and coordination
    appEventBus.on(APP_EVENTS.COPY_ACTION, ({ contentLength, success }) => {
        copyStats.total++;
        
        if (success) {
            copyStats.successful++;
            console.log(`[Copy] Successfully copied ${contentLength} characters`);
            
            // Could trigger other UI feedback here
            showGlobalCopyFeedback('success');
            
        } else {
            copyStats.failed++;
            console.log(`[Copy] Failed to copy content`);
            
            // Could show alternative copy methods or fallback
            showGlobalCopyFeedback('error');
        }
        
        // Update global stats
        updateCopyStats(copyStats);
    });
    
    // Listen to theme changes to update button styling
    onThemeChange(({ theme }) => {
        console.log(`[Copy Buttons] Adapting to theme change: ${theme}`);
        updateCopyButtonTheme(theme);
    });
    
    // Listen to component initialization to setup new copy buttons
    appEventBus.on(APP_EVENTS.COMPONENT_INITIALIZED, ({ componentName }) => {
        if (componentName === 'syntax-highlighting') {
            // Re-scan for new code blocks that might need copy buttons
            console.log('[Copy Buttons] Re-scanning for new copy buttons after syntax highlighting');
            // Could trigger a re-scan here
        }
    });
};

// Show global copy feedback
const showGlobalCopyFeedback = (type) => {
    // Could create a toast notification or update a status indicator
    const statusElement = document.querySelector('#copy-status');
    if (statusElement) {
        statusElement.textContent = type === 'success' ? 'Content copied!' : 'Copy failed';
        statusElement.className = `copy-status ${type}`;
        
        setTimeout(() => {
            statusElement.textContent = '';
            statusElement.className = 'copy-status';
        }, 2000);
    }
};

// Update copy button theme
const updateCopyButtonTheme = (theme) => {
    const copyButtons = document.querySelectorAll('pre + button, pre button');
    copyButtons.forEach(button => {
        button.setAttribute('data-theme', theme);
        
        // Could add theme-specific classes or styles
        if (theme === 'dark') {
            button.classList.add('dark-theme');
        } else {
            button.classList.remove('dark-theme');
        }
    });
};

// Update global copy statistics
const updateCopyStats = (stats) => {
    // Store stats for potential display in dev tools or admin panel
    window.COPY_STATS = stats;
    
    // Could emit stats to analytics service
    if (window.DEBUG_EVENTS) {
        console.log('[Copy Stats]', stats);
    }
};

// Export utilities for external access
export const getCopyStats = () => {
    return window.COPY_STATS || { total: 0, successful: 0, failed: 0 };
};

export const clearCopyStats = () => {
    window.COPY_STATS = { total: 0, successful: 0, failed: 0 };
    console.log('[Copy Stats] Statistics cleared');
}; 