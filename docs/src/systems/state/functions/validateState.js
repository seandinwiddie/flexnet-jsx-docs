// === State Validation ===
// Simple state validation utilities

export const validateState = (state) => {
    if (typeof state !== 'object' || state === null) {
        return { isValid: false, error: 'State must be an object' };
    }
    return { isValid: true };
}; 