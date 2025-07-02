// === Log Effects Module ===
// Side effect functions for logging operations

import { createEffect } from './createEffect.js';
import { EffectType } from './EffectType.js';

/**
 * Creates an effect to log a message
 * @param {string} message - The message to log
 * @param {string} level - The log level (default: 'info')
 * @returns {Effect} Log effect object
 */
export const logEffect = (message, level = 'info') =>
    createEffect(EffectType.LOG, 'log', { message, level });

/**
 * Creates an effect to log an error
 * @param {Error|string} error - The error to log
 * @param {Object} context - Additional context (default: {})
 * @returns {Effect} Log effect object
 */
export const logErrorEffect = (error, context = {}) =>
    createEffect(EffectType.LOG, 'error', { error, context }); 