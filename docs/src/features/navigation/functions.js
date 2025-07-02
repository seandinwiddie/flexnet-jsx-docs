// === FlexNet Navigation Functions ===
// Pure functional navigation and breadcrumb rendering with effect isolation

import Maybe from '../../core/types/maybe.js';
import Either from '../../core/types/either.js';
import { pipe, compose } from '../../core/functions/composition.js';
import { 
    query, 
    safeSetHTML, 
    logInfo, 
    logWarn, 
    sequence 
} from '../../systems/effects/functions.js';
import { createBreadcrumbSegment, getBasePath } from '../../core/functions/transforms.js';
import { escape } from '../../security/functions.js';

// Pure function to create breadcrumb HTML
const createBreadcrumbHTML = (pathSegments, basePath) => {
    const homeLink = `<a href="${basePath}/index.html" class="text-gray-600 dark:text-gray-400 hover:underline">Home</a>`;
    
    const segmentLinks = pathSegments.map((seg, idx) => {
        const segment = createBreadcrumbSegment(seg, idx, pathSegments);
        
        if (segment.isLast) {
            return `<span class="text-gray-800 dark:text-gray-200">${escape(segment.displayName)}</span>`;
        } else {
            return `<a href="${segment.path}" class="text-gray-600 dark:text-gray-400 hover:underline">${escape(segment.displayName)}</a>`;
        }
    }).join(' / ');
    
    if (segmentLinks) {
        return `${homeLink} / ${segmentLinks}`;
    } else {
        return homeLink;
    }
};

// Pure function to get current path segments
const getCurrentPathSegments = () => {
    if (typeof window === 'undefined') {
        return Either.Right([]);
    }
    
    const pathSegments = window.location.pathname.split('/').filter(Boolean);
    return Either.Right(pathSegments);
};

// Pure function to setup breadcrumbs effect
export const setupBreadcrumbsEffect = () => {
    return pipe(
        () => logInfo("[UI Setup] Initializing breadcrumbs."),
        () => query('#breadcrumbs'),
        (breadcrumbsResult) => {
            if (breadcrumbsResult.type === 'Left') {
                return logWarn("[UI Setup] Breadcrumbs element #breadcrumbs not found!");
            }

            return breadcrumbsResult.chain(maybeBreadcrumbs => {
                if (maybeBreadcrumbs.type === 'Nothing') {
                    return logWarn("[UI Setup] Breadcrumbs element #breadcrumbs not found!");
                }

                const container = maybeBreadcrumbs.value;
                
                return pipe(
                    () => getCurrentPathSegments(),
                    (pathSegmentsResult) => {
                        if (pathSegmentsResult.type === 'Left') {
                            return pathSegmentsResult;
                        }

                        const pathSegments = pathSegmentsResult.value;
                        const basePath = getBasePath();
                        const breadcrumbHTML = createBreadcrumbHTML(pathSegments, basePath);
                        
                        return safeSetHTML(breadcrumbHTML)(container);
                    }
                );
            });
        }
    );
};

// Legacy function wrapper for backward compatibility
export const setupBreadcrumbs = () => {
    const effectResult = setupBreadcrumbsEffect();
    
    if (effectResult.type === 'Left') {
        console.warn(effectResult.value);
        return null;
    }
    
    return effectResult.value;
};

// Pure function to create navigation state
export const createNavigationState = () => {
    return Either.Right({
        currentPath: typeof window !== 'undefined' ? window.location.pathname : '',
        breadcrumbs: [],
        basePath: getBasePath(),
        initialized: false
    });
};

// Pure navigation utilities
export const NavigationUtils = {
    createBreadcrumbHTML,
    getCurrentPathSegments,
    createNavigationState,
    setupBreadcrumbsEffect
}; 