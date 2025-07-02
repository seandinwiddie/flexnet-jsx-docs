import Result from '../../../core/types/result.js';

// Event cleanup utilities
export const createEventCleanup = () => {
    // Functional Set alternative
    let cleanupFunctions = [];
    
    return Object.freeze({
        add: (cleanupFn) => {
            if (typeof cleanupFn === 'function' && !cleanupFunctions.includes(cleanupFn)) {
                cleanupFunctions.push(cleanupFn);
                return true;
            }
            return false;
        },
        
        remove: (cleanupFn) => {
            const index = cleanupFunctions.indexOf(cleanupFn);
            if (index !== -1) {
                cleanupFunctions.splice(index, 1);
                return true;
            }
            return false;
        },
        
        cleanup: () => {
            const errors = [];
            
            cleanupFunctions.forEach(fn => {
                try {
                    fn();
                } catch (error) {
                    errors.push(error);
                }
            });
            
            cleanupFunctions = [];
            
            return errors.length > 0
                ? Result.Error(errors)
                : Result.Ok(true);
        },
        
        size: () => cleanupFunctions.length
    });
}; 