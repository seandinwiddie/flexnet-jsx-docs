// === Render System Functions ===
// UI component rendering and setup functions

import Maybe from '../../core/types/maybe.js';
import Result from '../../core/types/result.js';
import { pipe } from '../../core/functions/composition.js';
import { find } from '../../utils/array.js';
import { query, queryAll, addListener } from '../effects/functions.js';

// Logo setup function
export const setupLogo = (basePath) => {
    console.log("[UI Setup] Initializing logo.");
    
    const logoElement = query('#logo-image');
    if (logoElement.type === 'Just') {
        const img = logoElement.value;
        const logoSrc = `${basePath}/flexnet.png`;
        img.src = logoSrc;
            return img;
    } else {
        console.warn("[UI Setup] Logo element #logo-image not found!");
        return null;
    }
};

// Syntax highlighting setup
export const setupSyntaxHighlighting = () => {
    console.log("[UI Setup] Initializing syntax highlighting.");
    return Result.fromTry(() => {
        if (window.hljs) {
            window.hljs.highlightAll();
            return 'Syntax highlighting initialized';
        }
        return 'hljs not available';
    });
};

// Theme switcher setup
export const setupThemeSwitcher = () => {
    console.log("[UI Setup] Initializing theme switcher.");
    
    const themeToggle = query('#theme-toggle');
    if (themeToggle.type === 'Just') {
        const button = themeToggle.value;
        addListener('click', () => {
            const html = document.documentElement;
            html.classList.toggle('dark');
            localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
        }, button);
        return button;
    } else {
        console.warn("[UI Setup] Theme toggle button #theme-toggle not found!");
        return null;
    }
};

// Sidebar accordion functionality
export const setupSidebarAccordion = () => {
    console.log("[UI Setup] Initializing sidebar accordion.");
    
    const trySetupAccordion = (attempt = 1, maxAttempts = 5) => {
        const sidebarNav = document.querySelector('#sidebar-placeholder nav');
        
        if (!sidebarNav) {
            console.log(`[Accordion] Attempt ${attempt}: Sidebar nav not found, retrying...`);
            if (attempt < maxAttempts) {
                setTimeout(() => trySetupAccordion(attempt + 1, maxAttempts), 100);
            } else {
                console.warn("[Accordion] Failed to find sidebar nav after", maxAttempts, "attempts");
            }
            return [];
        }
        
        console.log("[Accordion] Found sidebar nav:", sidebarNav);
        
        // Find sections using the new structure with section-header class
        const sectionHeaders = Array.from(sidebarNav.querySelectorAll('.section-header'));
        console.log("[Accordion] Found section headers:", sectionHeaders.length);
        
        const sections = sectionHeaders
            .map(header => {
                const targetId = header.getAttribute('data-target');
                const content = targetId ? document.getElementById(targetId) : null;
                const icon = header.querySelector('.accordion-icon');
                return { header, content, icon, targetId };
            })
            .filter(section => section.header && section.content);
        
        console.log("[Accordion] Valid sections found:", sections.length);
        sections.forEach((section, index) => {
            console.log(`[Accordion] Section ${index}:`, section.targetId);
        });
    
            const currentPath = window.location.pathname;
        console.log("[Accordion] Current path:", currentPath);
    
            const getActiveSection = () => {
            // Find the section that contains the current page
            // We'll collect all matching sections and pick the most specific one
            const matchingSections = [];
            
            for (const section of sections) {
                    const links = Array.from(section.content.querySelectorAll('a'));
                const headerLink = section.header.querySelector('a');
                if (headerLink) links.push(headerLink);
                
                const matchingLinks = links.filter(link => {
                    if (!link) return false;
                    const href = link.getAttribute('href');
                    if (!href) return false;
                    
                    // Check if current path matches the href
                    const pathMatch = currentPath.endsWith(href) || 
                                    currentPath.includes(href.replace('.html', '')) ||
                                    (href === '/' && currentPath === '/') ||
                                    currentPath.includes(href.replace('/', ''));
                    
                    return pathMatch;
                });
                
                if (matchingLinks.length > 0) {
                    // Find the most specific matching link (longest href)
                    const mostSpecificLink = matchingLinks.reduce((longest, current) => {
                        const currentHref = current.getAttribute('href') || '';
                        const longestHref = longest.getAttribute('href') || '';
                        return currentHref.length > longestHref.length ? current : longest;
                    });
                    
                    matchingSections.push({
                        section,
                        matchingLink: mostSpecificLink,
                        specificity: mostSpecificLink.getAttribute('href').length
                    });
                    
                    console.log(`[Accordion] Found matching section: ${section.targetId} with link: ${mostSpecificLink.getAttribute('href')}`);
                }
            }
            
            if (matchingSections.length === 0) {
                console.log(`[Accordion] No active section found for path: ${currentPath}`);
                return { type: 'Nothing' };
            }
            
            // Pick the section with the most specific (longest) matching link
            // If there's a tie, prefer sections with header links closer to the path
            const mostSpecific = matchingSections.reduce((best, current) => {
                if (current.specificity > best.specificity) {
                    return current;
                } else if (current.specificity === best.specificity) {
                    // Tie-breaker: prefer sections with header links that are more specific to the current path
                    const currentHeaderLink = current.section.header.querySelector('a');
                    const bestHeaderLink = best.section.header.querySelector('a');
                    
                    if (currentHeaderLink && bestHeaderLink) {
                        const currentHeaderHref = currentHeaderLink.getAttribute('href') || '';
                        const bestHeaderHref = bestHeaderLink.getAttribute('href') || '';
                        
                        // Prefer the section whose header link is longer/more specific
                        if (currentHeaderHref.length > bestHeaderHref.length) {
                            console.log(`[Accordion] Tie-breaker: ${current.section.targetId} wins due to more specific header link`);
                            return current;
                        }
                    }
                    
                    // If still tied, prefer the section that comes later (more specific subsection)
                    console.log(`[Accordion] Tie-breaker: keeping ${best.section.targetId} (first encountered)`);
                    return best;
                }
                return best;
            });
            
            console.log(`[Accordion] Active section determined: ${mostSpecific.section.targetId} (specificity: ${mostSpecific.specificity})`);
            return { type: 'Just', value: mostSpecific.section };
            };
    
            const activeSection = getActiveSection();
        console.log("[Accordion] Active section found:", activeSection.type === 'Just' ? activeSection.value.targetId : 'None');
    
        // Initially hide all sections except the active one
        sections.forEach((section, index) => {
            const isSectionActive = activeSection.type === 'Just' && activeSection.value === section;
            
            console.log(`[Accordion] Section ${index} (${section.targetId}): active=${isSectionActive}`);
            
            if (isSectionActive) {
                section.content.classList.remove('hidden');
                if (section.icon) section.icon.textContent = '▼';
                console.log(`[Accordion] ✅ Showing active section: ${section.targetId}`);
            } else {
                section.content.classList.add('hidden');
                if (section.icon) section.icon.textContent = '▶';
                console.log(`[Accordion] ❌ Hiding section: ${section.targetId}`);
            }
    
            section.header.style.cursor = 'pointer';
            
            // Add click handler using native addEventListener instead of addListener
            section.header.addEventListener('click', e => {
                console.log(`[Accordion] Click event on section: ${section.targetId}`);
                console.log(`[Accordion] Click target:`, e.target);
                console.log(`[Accordion] Target tagName:`, e.target.tagName);
                
                // Don't prevent default if clicking on a link
                if (e.target.tagName === 'A') {
                    console.log(`[Accordion] Clicked on link, not toggling accordion`);
                    return;
                }
                
                e.preventDefault();
                console.log(`[Accordion] Processing accordion toggle for: ${section.targetId}`);
                    
                const isHidden = section.content.classList.contains('hidden');
                console.log(`[Accordion] Section is currently hidden: ${isHidden}`);
                
                if (isHidden) {
                    // Hide all other sections
                    sections.forEach(s => {
                        if (s !== section) {
                            s.content.classList.add('hidden');
                            if (s.icon) s.icon.textContent = '▶';
                            console.log(`[Accordion] Hiding section: ${s.targetId}`);
                        }
                    });
                    // Show this section
                    section.content.classList.remove('hidden');
                    if (section.icon) section.icon.textContent = '▼';
                    console.log(`[Accordion] Showing section: ${section.targetId}`);
                } else {
                    // Hide this section
                    section.content.classList.add('hidden');
                    if (section.icon) section.icon.textContent = '▶';
                    console.log(`[Accordion] Hiding section: ${section.targetId}`);
                }
            });
        });
        
        console.log("[Accordion] Setup complete");
            
            // Setup nested sections (like Project From Scratch under Reference Guides)
            setupNestedSections();
            
            return sections;
    };
    
    return trySetupAccordion();
};

// Setup nested collapsible sections within main sections
const setupNestedSections = () => {
    console.log("[Nested Accordion] Setting up nested sections");
    
    const nestedHeaders = Array.from(document.querySelectorAll('.nested-section-header'));
    const currentPath = window.location.pathname;
    
    nestedHeaders.forEach(header => {
        const targetId = header.getAttribute('data-target');
        const content = document.getElementById(targetId);
        const icon = header.querySelector('.accordion-icon');
        
        if (!content || !icon) {
            console.warn(`[Nested Accordion] Missing content or icon for header:`, header);
            return;
        }
        
        // Check if current page is within this nested section
        const links = Array.from(content.querySelectorAll('a'));
        const isActive = links.some(link => {
            const href = link.getAttribute('href');
            return href && (currentPath.endsWith(href) || currentPath.includes(href.replace('.html', '')));
        });
        
        // Also check the main header link
        const headerLink = header.querySelector('a');
        const isHeaderActive = headerLink && currentPath.includes(headerLink.getAttribute('href'));
        
        if (isActive || isHeaderActive) {
            console.log(`[Nested Accordion] Auto-expanding nested section: ${targetId}`);
            content.classList.remove('hidden');
            icon.textContent = '▼';
        } else {
            console.log(`[Nested Accordion] Keeping nested section collapsed: ${targetId}`);
            content.classList.add('hidden');
            icon.textContent = '▶';
        }
        
        // Add click handler for toggling
        header.addEventListener('click', (e) => {
            // Don't prevent default if clicking on the actual link
            if (e.target.tagName === 'A') {
                console.log(`[Nested Accordion] Clicked on link, not toggling nested section`);
                return;
            }
            
            e.preventDefault();
            e.stopPropagation();
            
            const isHidden = content.classList.contains('hidden');
            console.log(`[Nested Accordion] Toggling nested section ${targetId}, currently hidden: ${isHidden}`);
            
            if (isHidden) {
                content.classList.remove('hidden');
                icon.textContent = '▼';
            } else {
                content.classList.add('hidden');
                icon.textContent = '▶';
            }
        });
    });
    
    console.log(`[Nested Accordion] Setup complete for ${nestedHeaders.length} nested sections`);
};

// Sidebar active link highlighting
export const setupSidebarActiveLink = () => {
    console.log("[UI Setup] Initializing sidebar active link.");
    const currentPath = window.location.pathname;
    const sidebarLinks = Array.from(document.querySelectorAll('#sidebar-placeholder a'));
    return sidebarLinks
        .filter(link => currentPath.endsWith(link.getAttribute('href')))
        .map(link => {
            link.classList.add('bg-blue-500', 'text-white');
            link.classList.remove('dark:text-gray-300');
            return link;
        });
};

// Mobile sidebar functionality
export const setupMobileSidebar = () => {
    console.log("[UI Setup] Initializing mobile sidebar.");
    const sidebar = query('#sidebar-placeholder');
    const overlay = query('#sidebar-overlay');

    const closeSidebar = () => {
        pipe(sidebar, Maybe.map(s => s.classList.add('-translate-x-full')));
        pipe(overlay, Maybe.map(o => o.classList.add('hidden')));
    };

    const openSidebar = () => {
        pipe(sidebar, Maybe.map(s => s.classList.remove('-translate-x-full')));
        pipe(overlay, Maybe.map(o => o.classList.remove('hidden')));
    };

    pipe(query('#sidebar-toggle'), Maybe.map(addListener('click', openSidebar)));
    pipe(overlay, Maybe.map(addListener('click', closeSidebar)));
    
    return { closeSidebar, openSidebar };
};

// Copy buttons for code blocks
export const setupCopyButtons = () => {
    console.log("[UI Setup] Initializing copy buttons.");
    const preElements = Array.from(document.querySelectorAll('pre'));
    return preElements
        .map(pre => {
            const parent = pre.parentElement;
            const button = parent ? parent.querySelector('button') : null;
            if (button) {
                addListener('click', () => {
                    navigator.clipboard.writeText(pre.innerText).then(() => {
                        button.innerText = 'Copied!';
                        setTimeout(() => { button.innerText = 'Copy'; }, 2000);
                    });
                }, button);
                return button;
            }
            return null;
        })
        .filter(Boolean);
};
