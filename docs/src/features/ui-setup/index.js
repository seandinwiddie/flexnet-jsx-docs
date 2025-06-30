// === UI Setup Module ===
// Aggregates all UI setup functions for the application

import {
    setupLogo,
    setupSyntaxHighlighting,
    setupSidebarAccordion,
    setupSidebarActiveLink,
    setupMobileSidebar,
    setupCopyButtons
} from '../../systems/render/functions.js';

import { setupBreadcrumbs } from '../navigation/functions.js';

// Main UI setup orchestrator
export const setupUI = async (basePath) => {
    console.log("[UI Setup] Initializing all UI components.");
    const results = {
        logo: setupLogo(basePath),
        mobileSidebar: setupMobileSidebar(),
        breadcrumbs: setupBreadcrumbs(),
        copyButtons: setupCopyButtons(),
        sidebarActiveLink: setupSidebarActiveLink(),
        sidebarAccordion: setupSidebarAccordion(),
        syntaxHighlighting: setupSyntaxHighlighting()
    };
    console.log("[UI Setup] All components are set up.");
    return results;
}; 