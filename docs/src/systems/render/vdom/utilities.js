import Either from '../../../core/types/either.js';
import { escapeHTML } from '../../../security/xss.js';

// ===========================================
// UTILITY FUNCTIONS
// ===========================================

// Sanitize props object
export const sanitizeProps = (props) => {
    const sanitized = {};
    
    Object.entries(props || {}).forEach(([key, value]) => {
        if (typeof value === 'string' && !key.startsWith('on')) {
            sanitized[key] = escapeHTML(value);
        } else {
            sanitized[key] = value;
        }
    });
    
    return sanitized;
};

// Flatten children array (with deferred text node creation)
export const flattenChildren = (children, createTextNodeFn) => {
    const flattened = [];
    
    const flatten = (items) => {
        items.forEach(item => {
            if (Array.isArray(item)) {
                flatten(item);
            } else if (item != null && item !== false) {
                if (typeof item === 'string' || typeof item === 'number') {
                    if (createTextNodeFn) {
                        const textNodeResult = createTextNodeFn(item);
                        if (textNodeResult.type === 'Right') {
                            flattened.push(textNodeResult.value);
                        }
                    } else {
                        // Store primitive for later conversion
                        flattened.push({ __primitive: item });
                    }
                } else {
                    flattened.push(item);
                }
            }
        });
    };
    
    flatten(children);
    return flattened;
};

// Create set from keys without constructor
export const createSetFromKeys = (keys) => {
    const uniqueKeys = [];
    keys.forEach(key => {
        if (!uniqueKeys.includes(key)) {
            uniqueKeys.push(key);
        }
    });
    return uniqueKeys;
}; 