import Either from '../../../core/types/either.js';
import { curry } from '../../../core/functions/composition.js';

// Event validation utilities
export const validateEvent = curry((schema, handler) =>
    (event) => {
        const validation = validateEventStructure(schema, event);
        
        if (validation.type === 'Right') {
            return handler(event);
        } else {
            console.warn('Event validation failed:', validation.value);
            return null;
        }
    }
);

export const validateEventStructure = (schema, event) => {
    if (!schema || typeof schema !== 'object') {
        return Either.Left('Invalid schema');
    }
    
    if (!event || typeof event !== 'object') {
        return Either.Left('Invalid event');
    }
    
    try {
        const errors = [];
        
        Object.entries(schema).forEach(([property, validator]) => {
            if (typeof validator === 'function') {
                const result = validator(event[property]);
                if (result && result.type === 'Left') {
                    errors.push(`${property}: ${result.value}`);
                }
            }
        });
        
        return errors.length > 0
            ? Either.Left(errors.join(', '))
            : Either.Right(event);
    } catch (error) {
        return Either.Left(`Validation error: ${error.message}`);
    }
}; 