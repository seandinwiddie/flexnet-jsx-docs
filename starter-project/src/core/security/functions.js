import Either from '../types/either.js';
import Result from '../types/result.js';
import { compose } from '../functions/composition.js';

// Content escaping as specified in security-practices.md
const escape = str => compose(
    String,
    s => s.replace(/&/g, '&amp;')
         .replace(/</g, '&lt;')
         .replace(/>/g, '&gt;')
         .replace(/"/g, '&quot;')
         .replace(/'/g, '&#039;')
)(str);

// Input validation
const validateInput = input => {
    if (typeof input !== 'string') {
        return Either.Right(input);
    }
    
    const escaped = escape(input);
    return escaped.length === input.length
        ? Either.Right(input)
        : Either.Left('Invalid characters detected');
};

// Safe createElement validation
const validateElementType = type => {
    if (typeof type !== 'string' && typeof type !== 'function') {
        return Either.Left('Invalid element type');
    }
    return Either.Right(type);
};

// Sanitize props
const sanitizeProps = props => {
    if (!props) return Either.Right({});
    
    return Result.fromTry(() => {
        const safeProps = Object.entries(props).reduce((acc, [key, value]) => {
            // Prevent script injection in event handlers
            if (key.startsWith('on') && typeof value === 'string') {
                return acc;
            }
            // Escape string values
            if (typeof value === 'string') {
                const validation = validateInput(value);
                if (validation.type === 'Right') {
                    acc[key] = escape(value);
                } else {
                    // Skip invalid values
                    return acc;
                }
            } else {
                acc[key] = value;
            }
            return acc;
        }, {});
        
        return safeProps;
    });
};

// URL validation
const urlValidator = {
    allowedProtocols: ['https:', 'http:', 'data:image/', 'mailto:'],
    
    validate: url => {
        return Result.fromTry(() => {
            const parsed = new URL(url);
            return urlValidator.allowedProtocols.some(protocol => 
                parsed.protocol.startsWith(protocol))
                ? Either.Right(url)
                : Either.Left('Invalid protocol');
        }).chain(result => result);
    }
};

// Safe DOM operations
const safeDOMOperation = operation => {
    return Result.fromTry(operation);
};

export {
    escape,
    validateInput,
    validateElementType,
    sanitizeProps,
    urlValidator,
    safeDOMOperation
}; 