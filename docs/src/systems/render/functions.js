// === FlexNet Render System ===
// Pure functional UI rendering with effect isolation

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
// PURE UI STATE FUNCTIONS
// ===========================================

// UI state representation
const createUIState = (initialState = {}) =>
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
    Object.freeze({ ...state, sidebarOpen: !state.sidebarOpen })
);

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

// ===========================================
// PURE UI LOGIC FUNCTIONS
// ===========================================

// Calculate which section should be active based on current path
export const calculateActiveSection = curry((sections, currentPath) => {
    const matchingSections = sections
        .map(section => {
            const links = section.links || [];
            const headerLink = section.headerLink;
            const allLinks = headerLink ? [headerLink, ...links] : links;
            
            const matches = allLinks
                .filter(link => link.href)
                .map(link => ({
                    href: link.href,
                    specificity: calculatePathSpecificity(link.href, currentPath)
                }))
                .filter(match => match.specificity > 0);
            
            const bestMatch = matches.reduce(
                (best, current) => current.specificity > best.specificity ? current : best,
                { specificity: 0 }
            );
            
            return {
                section,
                specificity: bestMatch.specificity
            };
        })
        .filter(match => match.specificity > 0);
    
    if (matchingSections.length === 0) {
        return Maybe.Nothing();
    }
    
    const bestMatch = matchingSections.reduce(
        (best, current) => current.specificity > best.specificity ? current : best
    );
    
    return Maybe.Just(bestMatch.section);
});

// Calculate path specificity for link matching
const calculatePathSpecificity = (href, currentPath) => {
    if (!href || !currentPath) return 0;
    
    // Exact match gets highest score
    if (currentPath === href || currentPath.endsWith(href)) {
        return href.length + 1000;
    }
    
    // Partial match
    if (currentPath.includes(href.replace('.html', '')) || 
        currentPath.includes(href.replace('/', ''))) {
        return href.length;
    }
    
    return 0;
};

// Extract section data from DOM structure
export const extractSectionData = (navElement) =>
    Result.fromTry(() => {
        const headers = Array.from(navElement.querySelectorAll('.section-header'));
        
        return headers
            .map(header => {
                const targetId = header.getAttribute('data-target');
                const content = targetId ? document.getElementById(targetId) : null;
                const icon = header.querySelector('.accordion-icon');
                const headerLink = header.querySelector('a');
                const links = content ? Array.from(content.querySelectorAll('a')) : [];
                
                return {
                    id: targetId,
                    header,
                    content,
                    icon,
                    headerLink: headerLink ? { href: headerLink.getAttribute('href') } : null,
                    links: links.map(link => ({ href: link.getAttribute('href') }))
                };
            })
            .filter(section => section.header && section.content && section.id);
    });

// Generate effects for UI updates
export const createUIUpdateEffects = (state, config) => {
    const effects = [];
    
    // Theme effects
    if (state.theme) {
        effects.push(
            state.theme === 'dark'
                ? addClassEffect(document.documentElement, 'dark')
                : removeClassEffect(document.documentElement, 'dark')
        );
        effects.push(setLocalStorageEffect('theme', state.theme));
    }
    
    // Sidebar effects
    if (state.sidebarOpen !== undefined) {
        const sidebarClass = state.sidebarOpen ? 'translate-x-0' : '-translate-x-full';
        const overlayClass = state.sidebarOpen ? 'block' : 'hidden';
        
        effects.push(
            executeEffect(queryEffect(config.sidebarSelector))
                .then(sidebar => sidebar.type === 'Just' 
                    ? setAttributeEffect(sidebar.value, 'class', sidebarClass)
                    : null
                ),
            executeEffect(queryEffect(config.overlaySelector))
                .then(overlay => overlay.type === 'Just'
                    ? setAttributeEffect(overlay.value, 'class', overlayClass)
                    : null
                )
        );
    }
    
    return effects;
};

// ===========================================
// EFFECT-BASED COMPONENT SETUP
// ===========================================

// Pure logo setup using effects
export const setupLogoEffect = (basePath) =>
    createLogoConfig(basePath)
        .chain(config =>
            createAsyncEffect(async () => {
                await executeEffect(logEffect('Initializing logo', 'info'));
                
                const logoResult = await executeEffect(queryEffect(config.selector));
                
                if (logoResult.type === 'Just') {
                    await executeEffect(setAttributeEffect(logoResult.value, 'src', config.src));
                    await executeEffect(setAttributeEffect(logoResult.value, 'alt', config.alt));
                    return logoResult.value;
                } else {
                    await executeEffect(logEffect('Logo element not found', 'warn'));
                    return null;
                }
            })
        );

// Pure syntax highlighting setup using effects
export const setupSyntaxHighlightingEffect = () =>
    createAsyncEffect(async () => {
        await executeEffect(logEffect('Initializing syntax highlighting', 'info'));
        
        if (window.hljs) {
            window.hljs.highlightAll();
            return 'Syntax highlighting initialized';
        } else {
            await executeEffect(logEffect('hljs not available', 'warn'));
            return null;
        }
    });

// Pure theme switcher setup using effects
export const setupThemeSwitcherEffect = () =>
    createAsyncEffect(async () => {
        await executeEffect(logEffect('Initializing theme switcher', 'info'));
        
        const config = createThemeSwitcherConfig();
        const toggleResult = await executeEffect(queryEffect(config.selector));
        
        if (toggleResult.type === 'Just') {
            const button = toggleResult.value;
            
            // Load saved theme
            const savedTheme = await executeEffect(getLocalStorageEffect(config.storageKey));
            if (savedTheme === 'dark') {
                await executeEffect(addClassEffect(document.documentElement, config.darkClass));
            }
            
            // Add click handler
            const clickHandler = async () => {
                const html = document.documentElement;
                const isDark = html.classList.contains(config.darkClass);
                const newTheme = isDark ? 'light' : 'dark';
                
                if (isDark) {
                    await executeEffect(removeClassEffect(html, config.darkClass));
                } else {
                    await executeEffect(addClassEffect(html, config.darkClass));
                }
                
                await executeEffect(setLocalStorageEffect(config.storageKey, newTheme));
            };
            
            await executeEffect(addEventListenerEffect(button, 'click', clickHandler));
            return button;
        } else {
            await executeEffect(logEffect('Theme toggle button not found', 'warn'));
            return null;
        }
    });

// Pure sidebar accordion setup using effects
export const setupSidebarAccordionEffect = () =>
    createAsyncEffect(async () => {
        await executeEffect(logEffect('Initializing sidebar accordion', 'info'));
        
        const config = createSidebarConfig();
        
        // Retry mechanism for navigation discovery
        const findNavigation = async (attempt = 1, maxAttempts = 5) => {
            const navResult = await executeEffect(queryEffect(config.navSelector));
            
            if (navResult.type === 'Just') {
                return navResult.value;
            } else if (attempt < maxAttempts) {
                await executeEffect(logEffect(`Navigation not found, retrying (${attempt}/${maxAttempts})`, 'info'));
                await executeEffect(createDelayEffect(100));
                return findNavigation(attempt + 1, maxAttempts);
            } else {
                await executeEffect(logEffect('Navigation not found after retries', 'error'));
                return null;
            }
        };
        
        const nav = await findNavigation();
        if (!nav) return null;
        
        // Extract section data
        const sectionsResult = extractSectionData(nav);
        if (sectionsResult.type === 'Error') {
            await executeEffect(logEffect('Failed to extract section data', 'error'));
            return null;
        }
        
        const sections = sectionsResult.value;
        const currentPath = window.location.pathname;
        
        // Calculate active section
        const activeSection = calculateActiveSection(sections, currentPath);
        
        // Setup accordion state and effects
        await setupAccordionSections(sections, activeSection, config);
        await setupNestedSectionsEffect(config);
        
        await executeEffect(logEffect('Sidebar accordion setup complete', 'info'));
        return sections;
    });

// Setup accordion sections with effects
const setupAccordionSections = async (sections, activeSection, config) => {
    for (const section of sections) {
        const isActive = activeSection.type === 'Just' && activeSection.value.id === section.id;
        
        // Set initial state
        if (isActive) {
            await executeEffect(removeClassEffect(section.content, config.hiddenClass));
            if (section.icon) {
                await executeEffect(setTextContentEffect(section.icon, '▼'));
            }
        } else {
            await executeEffect(addClassEffect(section.content, config.hiddenClass));
            if (section.icon) {
                await executeEffect(setTextContentEffect(section.icon, '▶'));
            }
        }
        
        // Set cursor style
        await executeEffect(setStyleEffect(section.header, 'cursor', 'pointer'));
        
        // Add click handler
        const clickHandler = async (event) => {
            if (event.target.tagName === 'A') {
                return; // Don't interfere with link navigation
            }
            
            event.preventDefault();
            await toggleAccordionSection(section, sections, config);
        };
        
        await executeEffect(addEventListenerEffect(section.header, 'click', clickHandler));
    }
};

// Toggle accordion section with effects
const toggleAccordionSection = async (targetSection, allSections, config) => {
    const isHidden = targetSection.content.classList.contains(config.hiddenClass);
    
    if (isHidden) {
        // Hide all other sections
        for (const section of allSections) {
            if (section !== targetSection) {
                await executeEffect(addClassEffect(section.content, config.hiddenClass));
                if (section.icon) {
                    await executeEffect(setTextContentEffect(section.icon, '▶'));
                }
            }
        }
        
        // Show target section
        await executeEffect(removeClassEffect(targetSection.content, config.hiddenClass));
        if (targetSection.icon) {
            await executeEffect(setTextContentEffect(targetSection.icon, '▼'));
        }
    } else {
        // Hide target section
        await executeEffect(addClassEffect(targetSection.content, config.hiddenClass));
        if (targetSection.icon) {
            await executeEffect(setTextContentEffect(targetSection.icon, '▶'));
        }
    }
};

// Setup nested sections with effects
const setupNestedSectionsEffect = async (config) => {
    await executeEffect(logEffect('Setting up nested sections', 'info'));
    
    const nestedHeadersResult = await executeEffect(queryAllEffect(config.nestedHeaderClass));
    const currentPath = window.location.pathname;
    
    for (const header of nestedHeadersResult) {
        const targetId = header.getAttribute('data-target');
        const content = document.getElementById(targetId);
        const icon = header.querySelector('.accordion-icon');
        
        if (!content || !icon) continue;
        
        // Determine if section should be active
        const links = Array.from(content.querySelectorAll('a'));
        const headerLink = header.querySelector('a');
        const isActive = [...links, headerLink].some(link => {
            if (!link) return false;
            const href = link.getAttribute('href');
            return href && (currentPath.endsWith(href) || currentPath.includes(href.replace('.html', '')));
        });
        
        // Set initial state
        if (isActive) {
            await executeEffect(removeClassEffect(content, config.hiddenClass));
            await executeEffect(setTextContentEffect(icon, '▼'));
        } else {
            await executeEffect(addClassEffect(content, config.hiddenClass));
            await executeEffect(setTextContentEffect(icon, '▶'));
        }
        
        // Add click handler
        const clickHandler = async (event) => {
            if (event.target.tagName === 'A') return;
            
            event.preventDefault();
            event.stopPropagation();
            
            const isHidden = content.classList.contains(config.hiddenClass);
            
            if (isHidden) {
                await executeEffect(removeClassEffect(content, config.hiddenClass));
                await executeEffect(setTextContentEffect(icon, '▼'));
            } else {
                await executeEffect(addClassEffect(content, config.hiddenClass));
                await executeEffect(setTextContentEffect(icon, '▶'));
            }
        };
        
        await executeEffect(addEventListenerEffect(header, 'click', clickHandler));
    }
};

// Pure sidebar active link setup using effects
export const setupSidebarActiveLinkEffect = () =>
    createAsyncEffect(async () => {
        await executeEffect(logEffect('Initializing sidebar active link', 'info'));
        
        const currentPath = window.location.pathname;
        const linksResult = await executeEffect(queryAllEffect('#sidebar-placeholder a'));
        const config = createSidebarConfig();
        
        for (const link of linksResult) {
            const href = link.getAttribute('href');
            
            if (href && currentPath.endsWith(href)) {
                // Add active classes
                for (const className of config.activeClasses) {
                    await executeEffect(addClassEffect(link, className));
                }
                
                // Remove inactive classes
                for (const className of config.inactiveClasses) {
                    await executeEffect(removeClassEffect(link, className));
                }
            }
        }
        
        return linksResult;
    });

// Pure mobile sidebar setup using effects
export const setupMobileSidebarEffect = () =>
    createAsyncEffect(async () => {
        await executeEffect(logEffect('Initializing mobile sidebar', 'info'));
        
        const config = createSidebarConfig();
        
        const closeSidebar = async () => {
            const sidebarResult = await executeEffect(queryEffect(config.sidebarSelector));
            const overlayResult = await executeEffect(queryEffect(config.overlaySelector));
            
            if (sidebarResult.type === 'Just') {
                await executeEffect(addClassEffect(sidebarResult.value, '-translate-x-full'));
            }
            if (overlayResult.type === 'Just') {
                await executeEffect(addClassEffect(overlayResult.value, config.hiddenClass));
            }
        };
        
        const openSidebar = async () => {
            const sidebarResult = await executeEffect(queryEffect(config.sidebarSelector));
            const overlayResult = await executeEffect(queryEffect(config.overlaySelector));
            
            if (sidebarResult.type === 'Just') {
                await executeEffect(removeClassEffect(sidebarResult.value, '-translate-x-full'));
            }
            if (overlayResult.type === 'Just') {
                await executeEffect(removeClassEffect(overlayResult.value, config.hiddenClass));
            }
        };
        
        // Setup event listeners
        const toggleResult = await executeEffect(queryEffect(config.toggleSelector));
        const overlayResult = await executeEffect(queryEffect(config.overlaySelector));
        
        if (toggleResult.type === 'Just') {
            await executeEffect(addEventListenerEffect(toggleResult.value, 'click', openSidebar));
        }
        
        if (overlayResult.type === 'Just') {
            await executeEffect(addEventListenerEffect(overlayResult.value, 'click', closeSidebar));
        }
        
        return { closeSidebar, openSidebar };
    });

// Pure copy buttons setup using effects
export const setupCopyButtonsEffect = () =>
    createAsyncEffect(async () => {
        await executeEffect(logEffect('Initializing copy buttons', 'info'));
        
        const preElementsResult = await executeEffect(queryAllEffect('pre'));
        const setupButtons = [];
        
        for (const pre of preElementsResult) {
            const parent = pre.parentElement;
            const button = parent ? parent.querySelector('button') : null;
            
            if (button) {
                const clickHandler = async () => {
                    try {
                        await navigator.clipboard.writeText(pre.innerText);
                        await executeEffect(setTextContentEffect(button, 'Copied!'));
                        
                        // Reset after 2 seconds
                        await executeEffect(setTimeoutEffect(async () => {
                            await executeEffect(setTextContentEffect(button, 'Copy'));
                        }, 2000));
                    } catch (error) {
                        await executeEffect(logEffect('Failed to copy text', 'error'));
                    }
                };
                
                await executeEffect(addEventListenerEffect(button, 'click', clickHandler));
                setupButtons.push(button);
            }
        }
        
        return setupButtons;
    });

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
