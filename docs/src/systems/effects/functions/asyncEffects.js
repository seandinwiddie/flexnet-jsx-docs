// === Async Effects Module ===
// Side effect functions for asynchronous operations

import { createEffect } from './createEffect.js';
import { EffectType } from './EffectType.js';

/**
 * Creates an effect to execute an async function
 * @param {Function} asyncFunction - The async function to execute
 * @returns {Effect} Async effect object
 */
export const createAsyncEffect = (asyncFunction) =>
    createEffect(EffectType.ASYNC, 'execute', { asyncFunction }); 