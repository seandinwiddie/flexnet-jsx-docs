import { 
    executeEffect, 
    queryEffect,
    queryAllEffect,
    addClassEffect,
    removeClassEffect,
    addEventListenerEffect,
    setTextContentEffect,
    setStyleEffect,
    logEffect,
    createAsyncEffect,
    createDelayEffect
} from '../../effects/functions.js';
import { createSidebarConfig } from './componentConfigs.js';
import { calculateActiveSection, extractSectionData } from './uiLogic.js';
import { 
    appEventBus, 
    APP_EVENTS,
    emitSidebarSectionClicked,
    emitComponentInitialized,
    emitComponentError,
    onThemeChange
} from '../../events/appEventBus.js';

// ===========================================
// SIDEBAR ACCORDION SETUP WITH EVENT COORDINATION
// ===========================================

// Pure sidebar accordion setup using effects and event bus
export const setupSidebarAccordionEffect = () =>
    createAsyncEffect(async () => {
        await executeEffect(logEffect('Initializing sidebar accordion with event coordination', 'info'));
        
        const config = createSidebarConfig();
        
        try {
            // Retry mechanism for navigation discovery
            const nav = await findNavigation(config);
            if (!nav) {
                emitComponentError('sidebar-accordion', new Error('Navigation not found'));
                return null;
            }
            
            // Extract section data
            const sectionsResult = extractSectionData(nav);
            if (sectionsResult.type === 'Error') {
                await executeEffect(logEffect('Failed to extract section data', 'error'));
                emitComponentError('sidebar-accordion', new Error('Failed to extract section data'));
                return null;
            }
            
            const sections = sectionsResult.value;
            const currentPath = window.location.pathname;
            
            // Calculate active section
            const activeSection = calculateActiveSection(sections, currentPath);
            
            // Setup accordion state and effects with event coordination
            await setupAccordionSectionsWithEvents(sections, activeSection, config);
            await setupNestedSectionsWithEvents(config);
            
            // Setup event bus subscriptions
            setupSidebarEventSubscriptions(sections, config);
            
            emitComponentInitialized('sidebar-accordion', nav);
            await executeEffect(logEffect('Sidebar accordion setup complete with event coordination', 'info'));
            return sections;
            
        } catch (error) {
            emitComponentError('sidebar-accordion', error);
            await executeEffect(logEffect(`Sidebar accordion setup failed: ${error.message}`, 'error'));
            return null;
        }
    });

// Find navigation with retry mechanism
const findNavigation = async (config, attempt = 1, maxAttempts = 5) => {
    const navResult = await executeEffect(queryEffect(config.navSelector));
    
    if (navResult.type === 'Just') {
        return navResult.value;
    } else if (attempt < maxAttempts) {
        await executeEffect(logEffect(`Navigation not found, retrying (${attempt}/${maxAttempts})`, 'info'));
        await executeEffect(createDelayEffect(100));
        return findNavigation(config, attempt + 1, maxAttempts);
    } else {
        await executeEffect(logEffect('Navigation not found after retries', 'error'));
        return null;
    }
};

// Setup accordion sections with event coordination
export const setupAccordionSectionsWithEvents = async (sections, activeSection, config) => {
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
        
        // Add click handler with event coordination
        const clickHandler = async (event) => {
            if (event.target.tagName === 'A') {
                return; // Don't interfere with link navigation
            }
            
            event.preventDefault();
            
            // Emit section click event
            const isCurrentlyHidden = section.content.classList.contains(config.hiddenClass);
            emitSidebarSectionClicked(section.id, !isCurrentlyHidden);
            
            await toggleAccordionSectionWithEvents(section, sections, config);
        };
        
        await executeEffect(addEventListenerEffect(section.header, 'click', clickHandler));
    }
};

// Toggle accordion section with event coordination
export const toggleAccordionSectionWithEvents = async (targetSection, allSections, config) => {
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
        
        // Emit coordination events
        appEventBus.emit(APP_EVENTS.SIDEBAR_OPENED, { 
            sectionId: targetSection.id, 
            timestamp: Date.now() 
        });
        
    } else {
        // Hide target section
        await executeEffect(addClassEffect(targetSection.content, config.hiddenClass));
        if (targetSection.icon) {
            await executeEffect(setTextContentEffect(targetSection.icon, '▶'));
        }
        
        // Emit coordination events
        appEventBus.emit(APP_EVENTS.SIDEBAR_CLOSED, { 
            sectionId: targetSection.id, 
            timestamp: Date.now() 
        });
    }
};

// Setup nested sections with event coordination
export const setupNestedSectionsWithEvents = async (config) => {
    await executeEffect(logEffect('Setting up nested sections with event coordination', 'info'));
    
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
        
        // Add click handler with event coordination
        const clickHandler = async (event) => {
            if (event.target.tagName === 'A') return;
            
            event.preventDefault();
            event.stopPropagation();
            
            const isHidden = content.classList.contains(config.hiddenClass);
            
            // Emit nested section click event
            emitSidebarSectionClicked(targetId, isHidden);
            
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

// Setup event bus subscriptions for sidebar coordination
const setupSidebarEventSubscriptions = (sections, config) => {
    // Listen to theme changes to update sidebar styling
    onThemeChange(({ theme }) => {
        console.log(`[Sidebar] Adapting to theme change: ${theme}`);
        // Could add theme-specific sidebar adjustments here
    });
    
    // Listen to sidebar section clicks for analytics or other coordination
    appEventBus.on(APP_EVENTS.SIDEBAR_SECTION_CLICKED, ({ sectionId, isExpanded }) => {
        console.log(`[Sidebar] Section ${sectionId} ${isExpanded ? 'expanded' : 'collapsed'}`);
        
        // Could trigger other UI updates, analytics, etc.
        // Example: Update breadcrumbs, scroll position, etc.
    });
    
    // Listen to navigation events to update active sections
    appEventBus.on(APP_EVENTS.NAVIGATION_COMPLETED, async ({ path }) => {
        console.log(`[Sidebar] Navigation completed to: ${path}`);
        
        // Update active section based on new path
        const activeSection = calculateActiveSection(sections, path);
        if (activeSection.type === 'Just') {
            // Could highlight the active section
            console.log(`[Sidebar] Active section: ${activeSection.value.id}`);
        }
    });
};

// Export utilities for external coordination
export const getSidebarState = () => {
    const sidebar = document.querySelector('#sidebar-placeholder');
    return {
        isOpen: sidebar && !sidebar.classList.contains('hidden'),
        activeSection: calculateActiveSection([], window.location.pathname)
    };
}; 