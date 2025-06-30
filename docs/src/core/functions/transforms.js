// === Core Transform Functions ===
// Data transformation utilities for the FlexNet framework

import { compose } from './composition.js';

// Transform HTML content safely
export const createBreadcrumbSegment = (seg, idx, pathSegments) => {
    const cumulativePath = `/${pathSegments.slice(0, idx + 1).join('/')}`;
    const name = seg.replace('.html', '').replace(/-/g, ' ');
    const displayName = name.charAt(0).toUpperCase() + name.slice(1);
    
    return {
        path: cumulativePath,
        displayName,
        isLast: idx === pathSegments.length - 1
    };
};

// Calculate base path for relative navigation
export const getBasePath = () => {
    const path = window.location.pathname;
    
    // Split path and filter out empty segments
    const segments = path.split('/').filter(Boolean);
    
    // Calculate depth: 
    // - If path ends with .html, the depth is directory levels (segments.length - 1)
    // - If path ends with / or is a directory, depth is number of directory levels
    let depth;
    if (path.endsWith('.html')) {
        // For files like /getting-started-guide/index.html, we have 1 directory level
        depth = segments.length - 1;
    } else {
        // For directories like /getting-started-guide/ or /getting-started-guide, 
        // we count the directory segments
        depth = segments.length;
    }
    
    // If we're at root level, return current directory
    if (depth <= 0) {
        return '.';
    }
    
    // Return the appropriate number of "../" to get back to root
    return Array(depth).fill('..').join('/');
};
