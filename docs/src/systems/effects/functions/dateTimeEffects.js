// === DateTime Effects Module ===
// Side effect functions for date and time operations

import { createEffect } from './createEffect.js';
import { EffectType } from './EffectType.js';

/**
 * Creates an effect to get the current time
 * @returns {Effect} DateTime effect object
 */
export const getCurrentTimeEffect = () =>
    createEffect(EffectType.DATETIME, 'getCurrentTime', {});

/**
 * Creates an effect to get the current date
 * @returns {Effect} DateTime effect object
 */
export const getDateEffect = () =>
    createEffect(EffectType.DATETIME, 'getDate', {});

/**
 * Creates an effect to format a date
 * @param {Date} date - The date to format
 * @param {string} format - The format string
 * @returns {Effect} DateTime effect object
 */
export const formatDateEffect = (date, format) =>
    createEffect(EffectType.DATETIME, 'formatDate', { date, format }); 