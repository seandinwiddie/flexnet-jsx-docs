// === String Utility Functions ===
// String manipulation and validation utilities

// Capitalize first letter of a string
export const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

// Convert kebab-case to Title Case
export const kebabToTitle = str => str
    .split('-')
    .map(word => capitalize(word))
    .join(' ');

// Trim whitespace and normalize spaces
export const normalizeSpaces = str => str.trim().replace(/\s+/g, ' ');

// Check if string is empty or whitespace only
export const isEmpty = str => !str || str.trim().length === 0;
