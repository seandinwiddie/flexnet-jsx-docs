import Result from '../../../core/types/result.js';

// ===========================================
// PURE COMPONENT FUNCTIONS
// ===========================================

// Logo component configuration
export const createLogoConfig = (basePath) =>
    Result.fromTry(() => Object.freeze({
        selector: '#logo-image',
        src: `${basePath}/flexnet.png`,
        alt: 'FlexNet Framework Logo'
    }));

// Theme switcher configuration
export const createThemeSwitcherConfig = () =>
    Object.freeze({
        selector: '#theme-toggle',
        darkClass: 'dark',
        storageKey: 'theme'
    });

// Sidebar configuration
export const createSidebarConfig = () =>
    Object.freeze({
        sidebarSelector: '#sidebar-placeholder',
        overlaySelector: '#sidebar-overlay',
        toggleSelector: '#sidebar-toggle',
        navSelector: '#sidebar-placeholder nav',
        headerClass: '.section-header',
        nestedHeaderClass: '.nested-section-header',
        hiddenClass: 'hidden',
        activeClasses: ['bg-blue-500', 'text-white'],
        inactiveClasses: ['dark:text-gray-300']
    }); 