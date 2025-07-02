import { 
    executeEffect, 
    logEffect,
    createAsyncEffect
} from '../../effects/functions.js';
import { setupLogoEffect } from './logoSetup.js';
import { setupSyntaxHighlightingEffect } from './syntaxHighlighting.js';
import { setupThemeSwitcherEffect } from './themeSwitcher.js';
import { setupSidebarAccordionEffect } from './sidebarAccordion.js';
import { setupSidebarActiveLinkEffect } from './sidebarActiveLink.js';
import { setupMobileSidebarEffect } from './mobileSidebar.js';
import { setupCopyButtonsEffect } from './copyButtons.js';

// ===========================================
// COMPONENT ORCHESTRATION
// ===========================================

// Initialize all UI components using effects
export const initializeUI = (basePath) =>
    createAsyncEffect(async () => {
        await executeEffect(logEffect('Starting UI initialization', 'info'));
        
        const effects = [
            setupLogoEffect(basePath),
            setupSyntaxHighlightingEffect(),
            setupThemeSwitcherEffect(),
            setupSidebarAccordionEffect(),
            setupSidebarActiveLinkEffect(),
            setupMobileSidebarEffect(),
            setupCopyButtonsEffect()
        ];
        
        try {
            const results = await Promise.all(effects.map(executeEffect));
            await executeEffect(logEffect('UI initialization complete', 'info'));
            return results;
        } catch (error) {
            await executeEffect(logEffect('UI initialization failed', 'error'));
            throw error;
        }
    }); 