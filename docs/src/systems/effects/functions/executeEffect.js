import { Effect } from './effect.js';

// === Execute Effect ===
// Safely executes an effect and returns the result

export const executeEffect = (effect) => {
    try {
        return Effect.run(effect);
    } catch (error) {
        console.error('Effect execution error:', error);
        return null;
    }
}; 