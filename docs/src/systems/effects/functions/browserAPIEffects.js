// === Browser API Effects Module ===
// Side effect functions for browser API operations

import { createEffect } from './createEffect.js';
import { EffectType } from './EffectType.js';

/**
 * Creates an effect to get geolocation
 * @param {Object} options - Geolocation options (default: {})
 * @returns {Effect} Browser API effect object
 */
export const getGeolocationEffect = (options = {}) =>
    createEffect(EffectType.BROWSER_API, 'geolocation', { options });

/**
 * Creates an effect to show a notification
 * @param {string} title - The notification title
 * @param {Object} options - Notification options (default: {})
 * @returns {Effect} Browser API effect object
 */
export const showNotificationEffect = (title, options = {}) =>
    createEffect(EffectType.BROWSER_API, 'notification', { title, options }); 