import Either from '../../../core/types/either.js';

// ===========================================
// STATE VALIDATION UTILITIES
// ===========================================

export const validateState = (schema, state) => {
    if (!schema || typeof schema !== 'object') {
        return Either.Left('Invalid schema');
    }
    
    if (!state || typeof state !== 'object') {
        return Either.Left('Invalid state');
    }
    
    try {
        const errors = [];
        
        Object.entries(schema).forEach(([key, validator]) => {
            if (typeof validator === 'function') {
                const result = validator(state[key]);
                if (result && result.type === 'Left') {
                    errors.push(`${key}: ${result.value}`);
                }
            }
        });
        
        return errors.length > 0
            ? Either.Left(errors.join(', '))
            : Either.Right(state);
    } catch (error) {
        return Either.Left(`Validation error: ${error.message}`);
    }
}; 