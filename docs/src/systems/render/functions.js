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
    return pipe(
        query('#sidebar-placeholder nav'),
        Maybe.map(sidebarNav => {
            const sections = queryAll('h3', sidebarNav)
                .map(h3 => ({ header: h3, content: h3.nextElementSibling }))
                .filter(section => section.content && section.content.tagName === 'UL');
    
            const currentPath = window.location.pathname;
    
            const getActiveSection = () => {
                return find(section => {
                    const links = Array.from(section.content.querySelectorAll('a'));
                    links.push(section.header.querySelector('a'));
                    return links.some(link => link && currentPath.endsWith(link.getAttribute('href')));
                })(sections);
            };
    
            const activeSection = getActiveSection();
    
            sections.forEach(section => {
                const isSectionActive = activeSection.type === 'Just' && activeSection.value === section;
                const contentIsHidden = !isSectionActive;
                section.content.classList.toggle('hidden', contentIsHidden);
    
                section.header.style.cursor = 'pointer';
                addListener('click', e => {
                    if (e.target.tagName !== 'A') e.preventDefault();
                    
                    const isHidden = section.content.classList.contains('hidden');
                    if(isHidden) {
                        sections.forEach(s => {
                            if (s !== section) {
                                s.content.classList.add('hidden');
                            }
                        });
                        section.content.classList.remove('hidden');
                    } else {
                        section.content.classList.add('hidden');
                    }
                }, section.header);
            });
            return sections;
        }),
        Maybe.getOrElse([])
    );
};

// Sidebar active link highlighting
export const setupSidebarActiveLink = () => {
    console.log("[UI Setup] Initializing sidebar active link.");
    const currentPath = window.location.pathname;
    return queryAll('#sidebar-placeholder a')
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
    return queryAll('pre')
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
