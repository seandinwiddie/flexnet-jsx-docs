import { curry } from '../../../core/functions/composition.js';

// ===========================================
// PURE UI STATE FUNCTIONS
// ===========================================

// UI state representation
export const createUIState = (initialState = {}) =>
    Object.freeze({
        theme: 'light',
        sidebarOpen: false,
        activeSection: null,
        expandedSections: [],
        ...initialState
    });

// Pure state update functions
export const updateTheme = curry((theme, state) =>
    Object.freeze({ ...state, theme })
);

export const toggleSidebar = (state) =>
    Object.freeze({ ...state, sidebarOpen: !state.sidebarOpen });

export const setActiveSection = curry((section, state) =>
    Object.freeze({ ...state, activeSection: section })
);

export const toggleSection = curry((sectionId, state) => {
    const expanded = state.expandedSections || [];
    const isExpanded = expanded.includes(sectionId);
    
    return Object.freeze({
        ...state,
        expandedSections: isExpanded
            ? expanded.filter(id => id !== sectionId)
            : [...expanded, sectionId]
    });
}); 