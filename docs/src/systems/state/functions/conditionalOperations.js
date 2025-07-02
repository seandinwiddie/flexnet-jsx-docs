import { curry } from '../../../core/functions/composition.js';

// ===========================================
// CONDITIONAL STATE UPDATES
// ===========================================

export const updateWhen = curry((predicate, updater, state) =>
    predicate(state) ? updater(state) : state
);

export const updateUnless = curry((predicate, updater, state) =>
    updateWhen(state => !predicate(state), updater, state)
); 