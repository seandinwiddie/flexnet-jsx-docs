// === String Utility Functions ===
// Pure functional string manipulation utilities

import Maybe from '../core/types/maybe.js';

/**
 * Capitalizes the first letter of a string
 * @param {string} str - The string to capitalize
 * @returns {string} String with first letter capitalized
 */
export const capitalize = str => 
    str.length > 0 ? str.charAt(0).toUpperCase() + str.slice(1) : str;

/**
 * Safely trims a string, handling null/undefined
 * @param {string|null|undefined} str - The string to trim
 * @returns {Maybe<string>} Maybe containing the trimmed string
 */
export const safeTrim = str => 
    Maybe.fromNullable(str)
        .map(s => s.trim());

/**
 * Checks if a string is empty or whitespace only
 * @param {string} str - The string to check
 * @returns {boolean} True if string is empty or whitespace only
 */
export const isEmpty = str => 
    typeof str === 'string' && str.trim().length === 0;

// Convert kebab-case to Title Case
export const kebabToTitle = str => str
    .split('-')
    .map(word => capitalize(word))
    .join(' ');

// Trim whitespace and normalize spaces
export const normalizeSpaces = str => str.trim().replace(/\s+/g, ' ');
