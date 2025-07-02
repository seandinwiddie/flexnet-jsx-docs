// === Core Transform Functions ===
// Pure functional transformation utilities matching documented API

import { compose } from './composition.js';
import Maybe from '../types/maybe.js';
import Either from '../types/either.js';

// === Array Transforms (matching documentation) ===
export const map = fn => array => array.map(fn);
export const filter = predicate => array => array.filter(predicate);
export const reduce = (fn, initial) => array => array.reduce(fn, initial);

// === URL and Path Utilities ===
/**
 * Pure function to get the base path for the application
 * @returns {string} The base path
 */
export const getBasePath = () => {
    if (typeof window !== 'undefined' && window.location) {
        const pathname = window.location.pathname;
        // Remove trailing index.html or trailing slash for base path
        return pathname.replace(/\/index\.html$/, '').replace(/\/$/, '') || '.';
    }
    return '.';
};

/**
 * Transforms a URL to be relative to the base path
 * @param {string} url - The URL to transform
 * @param {string} basePath - The base path (optional, uses getBasePath() if not provided)
 * @returns {Either<string, string>} Either containing error or transformed URL
 */
export const transformUrl = (url, basePath = null) => {
    const base = basePath || getBasePath();
    
    if (typeof url !== 'string') {
        return Either.Left('URL must be a string');
    }
    
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) {
        return Either.Right(url); // Absolute URL, return as-is
    }
    
    const transformedUrl = url.startsWith('./') 
        ? `${base}/${url.slice(2)}`
        : url.startsWith('/') 
        ? `${base}${url}`
        : `${base}/${url}`;
    
    return Either.Right(transformedUrl);
};

/**
 * Transforms an object by applying a function to all its values
 * @param {Function} fn - The transformation function
 * @param {Object} obj - The object to transform
 * @returns {Maybe<Object>} Maybe containing the transformed object
 */
export const transformObject = (fn, obj) => 
    Maybe.fromNullable(obj)
        .map(o => 
            Object.keys(o).reduce((acc, key) => ({
                ...acc,
                [key]: fn(o[key])
            }), {})
        );

// === HTML Content Utilities ===
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
