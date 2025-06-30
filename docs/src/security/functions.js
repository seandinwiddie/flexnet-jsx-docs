// === Security Functions ===
// Core security utilities for XSS prevention and input validation

import { compose } from '../core/functions/composition.js';
import Either from '../core/types/either.js';

// HTML escape function to prevent XSS
export const escape = str => compose(
    String,
    s => s.replace(/&/g, '&amp;')
         .replace(/</g, '&lt;')
         .replace(/>/g, '&gt;')
         .replace(/"/g, '&quot;')
         .replace(/'/g, '&#039;')
)(str);

// Validate input using a predicate function
export const validateInput = predicate => input =>
    Either.fromNullable(input)
        .chain(value =>
            predicate(value)
                ? Either.Right(value)
                : Either.Left('Invalid input')
        );

// Sanitize URLs to prevent malicious redirects
export const sanitizeUrl = url => {
    const allowedProtocols = ['https:', 'http:', 'data:'];
    try {
        const parsed = new URL(url, window.location.origin);
        return allowedProtocols.some(protocol => 
            parsed.protocol === protocol)
            ? Either.Right(url)
            : Either.Left('Invalid protocol');
    } catch {
        return Either.Left('Invalid URL');
    }
};
