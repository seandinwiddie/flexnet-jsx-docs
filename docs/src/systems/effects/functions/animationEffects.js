// === Animation Effects Module ===
// Side effect functions for animation operations

import { createEffect } from './createEffect.js';
import { EffectType } from './EffectType.js';

/**
 * Creates an effect to request an animation frame
 * @param {Function} callback - The callback function to execute
 * @returns {Effect} Animation effect object
 */
export const requestAnimationFrameEffect = (callback) =>
    createEffect(EffectType.ANIMATION, 'requestAnimationFrame', { callback });

/**
 * Creates an effect to cancel an animation frame
 * @param {number} id - The animation frame ID to cancel
 * @returns {Effect} Animation effect object
 */
export const cancelAnimationFrameEffect = (id) =>
    createEffect(EffectType.ANIMATION, 'cancelAnimationFrame', { id }); 