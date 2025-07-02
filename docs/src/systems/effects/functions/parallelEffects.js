// === Parallel Effects ===
// Runs multiple effects in parallel

import { Effect } from './effect.js';

export const parallelEffects = (...effects) =>
    Effect.of(async () => {
        const promises = effects.map(effect => 
            Promise.resolve(Effect.run(effect))
        );
        return Promise.all(promises);
    }); 