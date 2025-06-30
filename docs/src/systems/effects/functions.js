// === Effects System Functions ===
// Side effect management and async operations

import Maybe from '../../core/types/maybe.js';
import Result from '../../core/types/result.js';
import { pipe } from '../../core/functions/composition.js';
import { sanitizeUrl } from '../../security/functions.js';

// DOM query functions with Maybe wrapping
export const query = selector => Maybe.fromNullable(document.querySelector(selector));
export const queryAll = selector => Array.from(document.querySelectorAll(selector));

// Safe HTML setting with Result wrapping
export const safeSetHTML = html => element => 
    Result.fromTry(() => {
        if (!element) throw new Error('Element is null');
        element.innerHTML = '';
        const parsed = new DOMParser().parseFromString(html, 'text/html');
        Array.from(parsed.body.childNodes).forEach(node => {
            if (node) element.appendChild(node.cloneNode(true));
        });
        return element;
    });

// Event listener management
export const addListener = (event, handler) => element => {
    element.addEventListener(event, handler);
    return element;
};

// Async resource fetching with error handling
export const fetchResource = async (url) => {
    const urlValidation = sanitizeUrl(url);
    if (urlValidation.type === 'Left') {
        return Result.Error(new Error(`Invalid URL: ${urlValidation.value}`));
    }

    try {
        const response = await fetch(url);
        if (!response.ok) {
            return Result.Error(new Error(`Request failed for ${url}: ${response.statusText}`));
        }
        return Result.Ok(await response.text());
    } catch (e) {
        console.error(`[fetchResource] A critical error occurred fetching ${url}:`, e);
        return Result.Error(e);
    }
};

// Component loading with error handling
export const loadComponent = async (placeholderId, url) => {
    const result = await fetchResource(url);

    if (result.type === 'Error') {
        console.warn(`Error loading component ${url}:`, result.error);
        return Result.Error(result.error);
    }

    const html = result.value;
    const maybePlaceholder = query(`#${placeholderId}`);
    
    if (maybePlaceholder.type === 'Nothing') {
        console.warn(`Placeholder element #${placeholderId} not found in the layout.`);
        return Result.Error(new Error('Placeholder not found'));
    }

    const htmlResult = Maybe.map(safeSetHTML(html))(maybePlaceholder);
    return Maybe.getOrElse(Result.Error(new Error('Failed to set HTML')))(htmlResult);
};
