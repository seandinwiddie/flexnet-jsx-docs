// === Chain Effects ===
// Composes multiple effects into a single effect

import { Effect } from './effect.js';

export const chainEffects = (...effects) =>
    Effect.of(() => {
        const results = [];
        for (const effect of effects) {
            results.push(Effect.run(effect));
        }
        return results;
    }); 