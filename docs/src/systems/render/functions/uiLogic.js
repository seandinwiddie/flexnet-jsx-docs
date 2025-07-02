import Maybe from '../../../core/types/maybe.js';
import Result from '../../../core/types/result.js';
import { curry } from '../../../core/functions/composition.js';
import { 
    executeEffect, 
    queryEffect,
    addClassEffect,
    removeClassEffect,
    setAttributeEffect,
    setLocalStorageEffect
} from '../../effects/functions.js';

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
export const calculatePathSpecificity = (href, currentPath) => {
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