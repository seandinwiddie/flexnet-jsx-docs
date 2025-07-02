// === Effect Composition Module ===
// Utilities for composing and combining effects

import Either from '../../../core/types/either.js';
import Result from '../../../core/types/result.js';
import { executeEffect } from './executeEffect.js';

/**
 * Chains multiple effects in sequence
 * @param {...Effect} effects - The effects to chain
 * @returns {Promise} Promise that resolves when all effects complete
 */
export const chainEffects = (...effects) =>
    effects.reduce(async (prevPromise, effect) => {
        await prevPromise;
        return executeEffect(effect);
    }, Promise.resolve());

/**
 * Executes multiple effects in parallel
 * @param {...Effect} effects - The effects to execute in parallel
 * @returns {Promise} Promise that resolves with all effect results
 */
export const parallelEffects = (...effects) =>
    Promise.all(effects.map(executeEffect));

/**
 * Safely executes an effect with error handling
 * @param {Effect} effect - The effect to execute safely
 * @returns {Promise<Either>} Either with error or result
 */
export const safeExecuteEffect = (effect) =>
    executeEffect(effect)
        .catch(error => Either.Left(error.message || 'Effect execution failed'));

/**
 * Batches multiple effects into a single result
 * @param {Effect[]} effects - Array of effects to batch
 * @returns {Result} Result containing array of effect promises
 */
export const batchEffects = (effects) =>
    Result.fromTry(() => effects.map(executeEffect)); 