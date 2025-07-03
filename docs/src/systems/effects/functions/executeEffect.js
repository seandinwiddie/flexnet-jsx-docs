import { Effect } from './effect.js';

// === Effect Executor ===
// Centralized function for running any effect

export const executeEffect = (effect) => {
    if (effect && typeof effect.run === 'function') {
        return effect.run();
    }
    // If it's not a valid effect, we can return a rejected promise or handle it gracefully.
    // For now, we'll log an error.
    console.error('Invalid effect passed to executeEffect:', effect);
    return Promise.reject('Invalid effect');
}; 