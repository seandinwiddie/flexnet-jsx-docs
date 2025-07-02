// === FlexNet Render System ===
// Pure functional rendering with proper effect isolation

import Maybe from '../../core/types/maybe.js';
import Either from '../../core/types/either.js';
import Result from '../../core/types/result.js';
import { pipe, compose } from '../../core/functions/composition.js';
import { find } from '../../utils/array.js';
import { 
    query, 
    queryAll, 
    addListener, 
    setAttribute, 
    addClass, 
    removeClass, 
    toggleClass,
    setTextContent,
    delay,
    logInfo,
    logWarn,
    logError,
    sequence,
    parallel
} from '../effects/functions.js';

// Pure function to create logo setup effect
export const createLogoSetupEffect = (basePath) => {
    const logoSrc = `${basePath}/flexnet.png`;
    
    return pipe(
        () => logInfo("[UI Setup] Initializing logo."),
        () => query('#logo-image'),
        (logoResult) => {
            if (logoResult.type === 'Left') {
                return logWarn("[UI Setup] Logo element #logo-image not found!");
            }

            return logoResult.chain(maybeElement => {
                if (maybeElement.type === 'Just') {
                    const element = maybeElement.value;
                    return setAttribute('src', logoSrc)(element);
                }
                return logWarn("[UI Setup] Logo element #logo-image not found!");
            });
        }
    );
};

// Pure function to create syntax highlighting effect
export const createSyntaxHighlightingEffect = () => {
    return pipe(
        () => logInfo("[UI Setup] Initializing syntax highlighting."),
        () => Result.fromTry(() => {
            if (typeof window !== 'undefined' && window.hljs) {
                window.hljs.highlightAll();
                return Either.Right('Syntax highlighting initialized');
            }
            return Either.Right('hljs not available');
        })
    );
};

// Pure function to create theme switcher effect
export const createThemeSwitcherEffect = () => {
    const themeToggleHandler = () => {
        const htmlResult = query('html');
        
        if (htmlResult.type === 'Right' && htmlResult.value.type === 'Just') {
            const htmlElement = htmlResult.value.value;
            const isDark = htmlElement.classList.contains('dark');
            
            if (isDark) {
                removeClass('dark')(htmlElement);
                // Storage effect should be handled separately
                if (typeof localStorage !== 'undefined') {
                    localStorage.setItem('theme', 'light');
                }
            } else {
                addClass('dark')(htmlElement);
                if (typeof localStorage !== 'undefined') {
                    localStorage.setItem('theme', 'dark');
                }
            }
        }
    };

    return pipe(
        () => logInfo("[UI Setup] Initializing theme switcher."),
        () => query('#theme-toggle'),
        (toggleResult) => {
            if (toggleResult.type === 'Left') {
                return logWarn("[UI Setup] Theme toggle button #theme-toggle not found!");
            }

            return toggleResult.chain(maybeButton => {
                if (maybeButton.type === 'Just') {
                    const button = maybeButton.value;
                    return addListener('click', themeToggleHandler)(button);
                }
                return logWarn("[UI Setup] Theme toggle button #theme-toggle not found!");
            });
        }
    );
};

// Pure function to determine active section
const determineActiveSection = (sections) => {
    if (typeof window === 'undefined') {
        return Either.Right(Maybe.Nothing());
    }

    const currentPath = window.location.pathname;
    
    const matchingSections = sections
        .map(section => {
            const links = Array.from(section.content.querySelectorAll('a'));
            const headerLink = section.header.querySelector('a');
            if (headerLink) links.push(headerLink);
            
            const matchingLinks = links.filter(link => {
                if (!link) return false;
                const href = link.getAttribute('href');
                if (!href) return false;
                
                const pathMatch = currentPath.endsWith(href) || 
                                currentPath.includes(href.replace('.html', '')) ||
                                (href === '/' && currentPath === '/') ||
                                currentPath.includes(href.replace('/', ''));
                
                return pathMatch;
            });
            
            if (matchingLinks.length > 0) {
                const mostSpecificLink = matchingLinks.reduce((longest, current) => {
                    const currentHref = current.getAttribute('href') || '';
                    const longestHref = longest.getAttribute('href') || '';
                    return currentHref.length > longestHref.length ? current : longest;
                });
                
                return {
                    section,
                    matchingLink: mostSpecificLink,
                    specificity: mostSpecificLink.getAttribute('href').length
                };
            }
            return null;
        })
        .filter(match => match !== null);

    if (matchingSections.length === 0) {
        return Either.Right(Maybe.Nothing());
    }

    const mostSpecific = matchingSections.reduce((best, current) => {
        if (current.specificity > best.specificity) {
            return current;
        } else if (current.specificity === best.specificity) {
            const currentHeaderLink = current.section.header.querySelector('a');
            const bestHeaderLink = best.section.header.querySelector('a');
            
            if (currentHeaderLink && bestHeaderLink) {
                const currentHeaderHref = currentHeaderLink.getAttribute('href') || '';
                const bestHeaderHref = bestHeaderLink.getAttribute('href') || '';
                
                if (currentHeaderHref.length > bestHeaderHref.length) {
                    return current;
                }
            }
            return best;
        }
        return best;
    });

    return Either.Right(Maybe.Just(mostSpecific.section));
};

// Pure function to apply section visibility
const applySectionVisibility = (section, isActive) => {
    const effects = [];
    
    if (isActive) {
        effects.push(removeClass('hidden')(section.content));
        if (section.icon) {
            effects.push(setTextContent('▼')(section.icon));
        }
    } else {
        effects.push(addClass('hidden')(section.content));
        if (section.icon) {
            effects.push(setTextContent('▶')(section.icon));
        }
    }
    
    effects.push(setAttribute('style', 'cursor: pointer')(section.header));
    
    return sequence(effects);
};

// Pure function to create accordion toggle handler
const createAccordionToggleHandler = (sections, currentSection) => (event) => {
    // Don't prevent default if clicking on a link
    if (event.target.tagName === 'A') {
        return Either.Right('Link clicked, not toggling accordion');
    }
    
    event.preventDefault();
    
    const isHidden = currentSection.content.classList.contains('hidden');
    const effects = [];
    
    if (isHidden) {
        // Hide all other sections
        sections.forEach(section => {
            if (section !== currentSection) {
                effects.push(addClass('hidden')(section.content));
                if (section.icon) {
                    effects.push(setTextContent('▶')(section.icon));
                }
            }
        });
        
        // Show current section
        effects.push(removeClass('hidden')(currentSection.content));
        if (currentSection.icon) {
            effects.push(setTextContent('▼')(currentSection.icon));
        }
    } else {
        // Hide current section
        effects.push(addClass('hidden')(currentSection.content));
        if (currentSection.icon) {
            effects.push(setTextContent('▶')(currentSection.icon));
        }
    }
    
    return sequence(effects);
};

// Pure function to setup accordion sections
const setupAccordionSections = (sections) => {
    return pipe(
        () => determineActiveSection(sections),
        (activeSectionResult) => {
            if (activeSectionResult.type === 'Left') {
                return activeSectionResult;
            }

            const activeSection = activeSectionResult.value;
            const effects = [];

            // Apply initial visibility to all sections
            sections.forEach(section => {
                const isActive = activeSection.type === 'Just' && activeSection.value === section;
                effects.push(applySectionVisibility(section, isActive));
                
                // Add click handler
                const toggleHandler = createAccordionToggleHandler(sections, section);
                effects.push(addListener('click', toggleHandler)(section.header));
            });

            return sequence(effects);
        }
    );
};

// Pure function to find accordion sections
const findAccordionSections = (sidebarNav) => {
    const sectionHeaders = Array.from(sidebarNav.querySelectorAll('.section-header'));
    
    const sections = sectionHeaders
        .map(header => {
            const targetId = header.getAttribute('data-target');
            const content = targetId ? document.getElementById(targetId) : null;
            const icon = header.querySelector('.accordion-icon');
            return { header, content, icon, targetId };
        })
        .filter(section => section.header && section.content);
    
    return Either.Right(sections);
};

// Pure function to attempt accordion setup
const attemptAccordionSetup = async (attempt = 1, maxAttempts = 5) => {
    const sidebarNavResult = query('#sidebar-placeholder nav');
    
    if (sidebarNavResult.type === 'Left') {
        if (attempt < maxAttempts) {
            logInfo(`[Accordion] Attempt ${attempt}: Sidebar nav not found, retrying...`);
            await delay(100);
            return attemptAccordionSetup(attempt + 1, maxAttempts);
        } else {
            return logWarn(`[Accordion] Failed to find sidebar nav after ${maxAttempts} attempts`);
        }
    }

    return sidebarNavResult.chain(maybeSidebarNav => {
        if (maybeSidebarNav.type === 'Nothing') {
            if (attempt < maxAttempts) {
                return delay(100).then(() => attemptAccordionSetup(attempt + 1, maxAttempts));
            } else {
                return logWarn(`[Accordion] Failed to find sidebar nav after ${maxAttempts} attempts`);
            }
        }

        const sidebarNav = maybeSidebarNav.value;
        logInfo("[Accordion] Found sidebar nav");

        return pipe(
            () => findAccordionSections(sidebarNav),
            (sectionsResult) => {
                if (sectionsResult.type === 'Left') {
                    return sectionsResult;
                }

                const sections = sectionsResult.value;
                logInfo(`[Accordion] Found ${sections.length} valid sections`);

                return pipe(
                    () => setupAccordionSections(sections),
                    () => setupNestedSectionsEffect(),
                    () => {
                        logInfo("[Accordion] Setup complete");
                        return Either.Right(sections);
                    }
                );
            }
        );
    });
};

// Pure function to create sidebar accordion effect
export const createSidebarAccordionEffect = () => {
    return pipe(
        () => logInfo("[UI Setup] Initializing sidebar accordion."),
        () => attemptAccordionSetup()
    );
};

// Pure function to setup nested sections
const setupNestedSectionsEffect = () => {
    return pipe(
        () => logInfo("[Nested Accordion] Setting up nested sections"),
        () => queryAll('.nested-section-header'),
        (headersResult) => {
            if (headersResult.type === 'Left') {
                return headersResult;
            }

            const headers = headersResult.value;
            const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
            const effects = [];

            headers.forEach(header => {
                const targetId = header.getAttribute('data-target');
                const content = document.getElementById(targetId);
                const icon = header.querySelector('.accordion-icon');
                
                if (!content || !icon) {
                    logWarn(`[Nested Accordion] Missing content or icon for header:`, header);
                    return;
                }
                
                // Check if current page is within this nested section
                const links = Array.from(content.querySelectorAll('a'));
                const isActive = links.some(link => {
                    const href = link.getAttribute('href');
                    return href && (currentPath.endsWith(href) || currentPath.includes(href.replace('.html', '')));
                });
                
                const headerLink = header.querySelector('a');
                const isHeaderActive = headerLink && currentPath.includes(headerLink.getAttribute('href'));
                
                if (isActive || isHeaderActive) {
                    logInfo(`[Nested Accordion] Auto-expanding nested section: ${targetId}`);
                    effects.push(removeClass('hidden')(content));
                    effects.push(setTextContent('▼')(icon));
                } else {
                    logInfo(`[Nested Accordion] Keeping nested section collapsed: ${targetId}`);
                    effects.push(addClass('hidden')(content));
                    effects.push(setTextContent('▶')(icon));
                }
                
                // Add click handler for toggling
                const nestedToggleHandler = (event) => {
                    if (event.target.tagName === 'A') {
                        logInfo(`[Nested Accordion] Clicked on link, not toggling nested section`);
                        return Either.Right('Link clicked');
                    }
                    
                    event.preventDefault();
                    event.stopPropagation();
                    
                    const isHidden = content.classList.contains('hidden');
                    logInfo(`[Nested Accordion] Toggling nested section ${targetId}, currently hidden: ${isHidden}`);
                    
                    if (isHidden) {
                        return sequence([
                            removeClass('hidden')(content),
                            setTextContent('▼')(icon)
                        ]);
                    } else {
                        return sequence([
                            addClass('hidden')(content),
                            setTextContent('▶')(icon)
                        ]);
                    }
                };
                
                effects.push(addListener('click', nestedToggleHandler)(header));
            });

            logInfo(`[Nested Accordion] Setup complete for ${headers.length} nested sections`);
            return sequence(effects);
        }
    );
};

// Pure function to create sidebar active link effect
export const createSidebarActiveLinkEffect = () => {
    return pipe(
        () => logInfo("[UI Setup] Initializing sidebar active link."),
        () => {
            if (typeof window === 'undefined') {
                return Either.Right([]);
            }

            const currentPath = window.location.pathname;
            const sidebarLinks = Array.from(document.querySelectorAll('#sidebar-placeholder a'));
            
            const effects = sidebarLinks
                .filter(link => currentPath.endsWith(link.getAttribute('href')))
                .map(link => {
                    return sequence([
                        addClass('bg-blue-500')(link),
                        addClass('text-white')(link),
                        removeClass('dark:text-gray-300')(link)
                    ]);
                });

            return sequence(effects);
        }
    );
};

// Pure function to create mobile sidebar effects
export const createMobileSidebarEffect = () => {
    return pipe(
        () => logInfo("[UI Setup] Initializing mobile sidebar."),
        () => {
            const sidebarResult = query('#sidebar-placeholder');
            const overlayResult = query('#sidebar-overlay');

            if (sidebarResult.type === 'Left' || overlayResult.type === 'Left') {
                return logWarn("[Mobile Sidebar] Required elements not found");
            }

            const closeSidebar = () => {
                return sequence([
                    sidebarResult.chain(maybeSidebar => 
                        maybeSidebar.type === 'Just' ? 
                        addClass('-translate-x-full')(maybeSidebar.value) : 
                        Either.Right(null)
                    ),
                    overlayResult.chain(maybeOverlay => 
                        maybeOverlay.type === 'Just' ? 
                        addClass('hidden')(maybeOverlay.value) : 
                        Either.Right(null)
                    )
                ]);
            };

            const openSidebar = () => {
                return sequence([
                    sidebarResult.chain(maybeSidebar => 
                        maybeSidebar.type === 'Just' ? 
                        removeClass('-translate-x-full')(maybeSidebar.value) : 
                        Either.Right(null)
                    ),
                    overlayResult.chain(maybeOverlay => 
                        maybeOverlay.type === 'Just' ? 
                        removeClass('hidden')(maybeOverlay.value) : 
                        Either.Right(null)
                    )
                ]);
            };

            const toggleButtonResult = query('#sidebar-toggle');
            const effects = [];

            if (toggleButtonResult.type === 'Right' && toggleButtonResult.value.type === 'Just') {
                effects.push(addListener('click', openSidebar)(toggleButtonResult.value.value));
            }

            if (overlayResult.type === 'Right' && overlayResult.value.type === 'Just') {
                effects.push(addListener('click', closeSidebar)(overlayResult.value.value));
            }

            return sequence(effects).map(() => ({ closeSidebar, openSidebar }));
        }
    );
};

// Pure function to create copy buttons effect
export const createCopyButtonsEffect = () => {
    return pipe(
        () => logInfo("[UI Setup] Initializing copy buttons."),
        () => queryAll('pre'),
        (preElementsResult) => {
            if (preElementsResult.type === 'Left') {
                return preElementsResult;
            }

            const preElements = preElementsResult.value;
            const effects = [];

            preElements.forEach(pre => {
                const parent = pre.parentElement;
                const button = parent ? parent.querySelector('button') : null;
                
                if (button) {
                    const copyHandler = async () => {
                        try {
                            await navigator.clipboard.writeText(pre.innerText);
                            setTextContent('Copied!')(button);
                            setTimeout(() => {
                                setTextContent('Copy')(button);
                            }, 2000);
                        } catch (error) {
                            logError('Failed to copy text:', error);
                        }
                    };

                    effects.push(addListener('click', copyHandler)(button));
                }
            });

            return sequence(effects);
        }
    );
};

// Pure function to setup all render effects
export const setupRenderEffects = (basePath) => {
    const effects = [
        createLogoSetupEffect(basePath),
        createSyntaxHighlightingEffect(),
        createThemeSwitcherEffect(),
        createSidebarAccordionEffect(),
        createSidebarActiveLinkEffect(),
        createMobileSidebarEffect(),
        createCopyButtonsEffect()
    ];

    return parallel(effects);
};
