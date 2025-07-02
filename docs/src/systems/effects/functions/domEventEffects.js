import { createEffect } from './createEffect.js';
import { EffectType } from './EffectType.js';

// DOM event effects
export const addEventListenerEffect = (element, event, handler, options = {}) =>
    createEffect(EffectType.DOM, 'addEventListener', { element, event, handler, options });

export const removeEventListenerEffect = (element, event, handler, options = {}) =>
    createEffect(EffectType.DOM, 'removeEventListener', { element, event, handler, options }); 