// === Navigation Functions ===
// Navigation and breadcrumb rendering functionality

import Maybe from '../../core/types/maybe.js';
import { pipe } from '../../core/functions/composition.js';
import { query } from '../../systems/effects/functions.js';
import { createBreadcrumbSegment, getBasePath } from '../../core/functions/transforms.js';
import { escape } from '../../security/functions.js';

// Setup breadcrumb navigation
export const setupBreadcrumbs = () => {
    console.log("[UI Setup] Initializing breadcrumbs.");
    
    const breadcrumbsElement = query('#breadcrumbs');
    if (breadcrumbsElement.type === 'Just') {
        const container = breadcrumbsElement.value;
        container.innerHTML = '';
        const pathSegments = window.location.pathname.split('/').filter(Boolean);
        
        const homeLink = document.createElement('a');
        homeLink.href = `${getBasePath()}/index.html`;
        homeLink.className = 'text-gray-600 dark:text-gray-400 hover:underline';
        homeLink.textContent = 'Home';
        container.appendChild(homeLink);
        
        pathSegments.forEach((seg, idx) => {
            container.insertAdjacentText('beforeend', ' / ');
            const segment = createBreadcrumbSegment(seg, idx, pathSegments);

            if (segment.isLast) {
                const breadcrumb = document.createElement('span');
                breadcrumb.className = 'text-gray-800 dark:text-gray-200';
                breadcrumb.textContent = escape(segment.displayName);
                container.appendChild(breadcrumb);
            } else {
                const breadcrumb = document.createElement('a');
                breadcrumb.href = segment.path;
                breadcrumb.className = 'text-gray-600 dark:text-gray-400 hover:underline';
                breadcrumb.textContent = escape(segment.displayName);
                container.appendChild(breadcrumb);
            }
        });
        return container;
    } else {
        console.warn("[UI Setup] Breadcrumbs element #breadcrumbs not found!");
        return null;
    }
}; 