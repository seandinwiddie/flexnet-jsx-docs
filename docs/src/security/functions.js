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

// Functional URL validation without constructors
const isValidProtocol = (protocol) => {
    const allowedProtocols = ['https:', 'http:', 'data:'];
    return allowedProtocols.includes(protocol);
};

const parseURLComponents = (url) => {
    // Simple URL parsing using string operations
    if (typeof url !== 'string' || url.length === 0) {
        return Either.Left('URL must be a non-empty string');
    }
    
    // Check for protocol
    const protocolMatch = url.match(/^([a-zA-Z][a-zA-Z\d+\-.]*:)/);
    if (!protocolMatch) {
        return Either.Left('URL must include protocol');
    }
    
    const protocol = protocolMatch[1];
    const remainingUrl = url.slice(protocol.length);
    
    // Basic validation for common URL patterns
    if (protocol === 'data:' && remainingUrl.startsWith('image/')) {
        return Either.Right({ protocol, isValid: true });
    }
    
    if ((protocol === 'http:' || protocol === 'https:') && remainingUrl.startsWith('//')) {
        return Either.Right({ protocol, isValid: true });
    }
    
    return Either.Left('Invalid URL format');
};

// Sanitize URLs to prevent malicious redirects
export const sanitizeUrl = url => {
    return parseURLComponents(url)
        .chain(components => 
            isValidProtocol(components.protocol)
                ? Either.Right(url)
                : Either.Left('Invalid protocol')
        );
};
