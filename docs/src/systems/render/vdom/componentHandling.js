import Either from '../../../core/types/either.js';
import Result from '../../../core/types/result.js';

// ===========================================
// COMPONENT HANDLING
// ===========================================

// Render component function
export const renderComponent = (component, props = {}) => {
    return Result.fromTry(() => {
        if (typeof component !== 'function') {
            return Either.Left('Component must be a function');
        }

        const result = component(props);
        
        if (!result || typeof result !== 'object') {
            return Either.Left('Component must return a virtual node');
        }

        return Either.Right(result);
    }).fold(
        (error) => Either.Left(`Component render failed: ${error}`),
        (result) => result
    );
}; 