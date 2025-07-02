// === Timer Effects Module ===
// Side effect functions for timer operations

import { createEffect } from './createEffect.js';
import { EffectType } from './EffectType.js';

/**
 * Creates an effect to set a timeout
 * @param {Function} callback - The callback function to execute
 * @param {number} delay - The delay in milliseconds
 * @returns {Effect} Timer effect object
 */
export const setTimeoutEffect = (callback, delay) =>
    createEffect(EffectType.TIMER, 'setTimeout', { callback, delay });

/**
 * Creates an effect to set an interval
 * @param {Function} callback - The callback function to execute
 * @param {number} interval - The interval in milliseconds
 * @returns {Effect} Timer effect object
 */
export const setIntervalEffect = (callback, interval) =>
    createEffect(EffectType.TIMER, 'setInterval', { callback, interval });

/**
 * Creates an effect to clear a timeout
 * @param {number} timeoutId - The timeout ID to clear
 * @returns {Effect} Timer effect object
 */
export const clearTimeoutEffect = (timeoutId) =>
    createEffect(EffectType.TIMER, 'clearTimeout', { timeoutId });

/**
 * Creates an effect to clear an interval
 * @param {number} intervalId - The interval ID to clear
 * @returns {Effect} Timer effect object
 */
export const clearIntervalEffect = (intervalId) =>
    createEffect(EffectType.TIMER, 'clearInterval', { intervalId });

/**
 * Creates an effect to create a delay (Promise-based)
 * @param {number} delay - The delay in milliseconds
 * @returns {Effect} Timer effect object
 */
export const createDelayEffect = (delay) =>
    createEffect(EffectType.TIMER, 'delay', { delay }); 