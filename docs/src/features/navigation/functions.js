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
    
    return query('#breadcrumbs')
        .map(container => {
            container.innerHTML = '';
            const pathSegments = window.location.pathname.split('/').filter(Boolean);
            
            const homeLink = document.createElement('a');
            homeLink.href = `${getBasePath()}/index.html`;
            homeLink.className = 'text-gray-600 dark:text-gray-400 hover:underline';
            homeLink.textContent = 'Home';
            container.appendChild(homeLink);
            
            if (pathSegments.length > 0) {
                pathSegments.forEach((segment, index) => {
                    // Add separator
                    const separator = document.createElement('span');
                    separator.className = 'mx-2 text-gray-400 dark:text-gray-600';
                    separator.textContent = '>';
                    container.appendChild(separator);
                    
                    const breadcrumb = createBreadcrumbSegment(segment, index, pathSegments);
                    
                    if (breadcrumb.isLast) {
                        const span = document.createElement('span');
                        span.className = 'text-gray-800 dark:text-gray-200 font-medium';
                        span.textContent = breadcrumb.displayName;
                        container.appendChild(span);
                    } else {
                        const link = document.createElement('a');
                        link.href = `${getBasePath()}${breadcrumb.path}`;
                        link.className = 'text-gray-600 dark:text-gray-400 hover:underline';
                        link.textContent = breadcrumb.displayName;
                        container.appendChild(link);
                    }
                });
            }
            
            return container;
        })
        .getOrElse(null);
}; 