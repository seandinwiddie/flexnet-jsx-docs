// === Random Effects Module ===
// Side effect functions for random number generation

import { createEffect } from './createEffect.js';
import { EffectType } from './EffectType.js';

/**
 * Creates an effect to generate a random number
 * @param {number} min - Minimum value (default: 0)
 * @param {number} max - Maximum value (default: 1)
 * @returns {Effect} Random effect object
 */
export const randomNumberEffect = (min = 0, max = 1) =>
    createEffect(EffectType.RANDOM, 'number', { min, max });

/**
 * Creates an effect to generate a random integer
 * @param {number} min - Minimum integer value
 * @param {number} max - Maximum integer value
 * @returns {Effect} Random effect object
 */
export const randomIntegerEffect = (min, max) =>
    createEffect(EffectType.RANDOM, 'integer', { min, max });

/**
 * Creates an effect to generate a random UUID
 * @returns {Effect} Random effect object
 */
export const randomUUIDEffect = () =>
    createEffect(EffectType.RANDOM, 'uuid', {}); 