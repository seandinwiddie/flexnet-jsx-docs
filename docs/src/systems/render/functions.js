// === FlexNet Render System ===
// Pure functional UI rendering with effect isolation
// Now organized into individual function modules

import Maybe from '../../core/types/maybe.js';
import Either from '../../core/types/either.js';
import Result from '../../core/types/result.js';
import { compose, pipe, curry } from '../../core/functions/composition.js';
import { 
    executeEffect, 
    chainEffects, 
    parallelEffects,
    queryEffect,
    queryAllEffect,
    getElementByIdEffect,
    setAttributeEffect,
    addClassEffect,
    removeClassEffect,
    setStyleEffect,
    addEventListenerEffect,
    setTextContentEffect,
    setLocalStorageEffect,
    getLocalStorageEffect,
    logEffect,
    setTimeoutEffect,
    createAsyncEffect,
    createDelayEffect
} from '../effects/functions.js';

// ===========================================
// CORE RENDER SYSTEM IMPORTS
// ===========================================

// UI State Management
export { 
    createUIState, 
    updateTheme, 
    toggleSidebar, 
    setActiveSection, 
    toggleSection 
} from './functions/uiState.js';

// Component Configurations
export { 
    createLogoConfig, 
    createThemeSwitcherConfig, 
    createSidebarConfig 
} from './functions/componentConfigs.js';

// UI Logic Functions
export { 
    calculateActiveSection, 
    calculatePathSpecificity, 
    extractSectionData, 
    createUIUpdateEffects 
} from './functions/uiLogic.js';

// Component Setup Functions
export { setupLogoEffect, createLogoHTML } from './functions/logoSetup.js';
export { setupSyntaxHighlightingEffect, highlightCodeBlocks, isHighlightJSLoaded } from './functions/syntaxHighlighting.js';
export { setupThemeSwitcherEffect, getCurrentTheme, setTheme } from './functions/themeSwitcher.js';

// Sidebar Functions
export { 
    setupSidebarAccordionEffect, 
    setupAccordionSectionsWithEvents, 
    toggleAccordionSectionWithEvents, 
    setupNestedSectionsWithEvents,
    getSidebarState
} from './functions/sidebarAccordion.js';
export { setupSidebarActiveLinkEffect } from './functions/sidebarActiveLink.js';
export { setupMobileSidebarEffect } from './functions/mobileSidebar.js';

// Additional Component Setup
export { setupCopyButtonsEffect, getCopyStats, clearCopyStats } from './functions/copyButtons.js';

// Component Orchestration
export { initializeUI } from './functions/componentOrchestration.js';

// ===========================================
// CONVENIENCE EXPORT OBJECT
// ===========================================

// Import for re-export in convenience object
import { 
    createUIState, 
    updateTheme, 
    toggleSidebar, 
    setActiveSection, 
    toggleSection 
} from './functions/uiState.js';
import { calculateActiveSection, extractSectionData, createUIUpdateEffects } from './functions/uiLogic.js';

// Export pure utility functions
export const UI_UTILS = Object.freeze({
    createUIState,
    updateTheme,
    toggleSidebar,
    setActiveSection,
    toggleSection,
    calculateActiveSection,
    extractSectionData,
    createUIUpdateEffects
});
