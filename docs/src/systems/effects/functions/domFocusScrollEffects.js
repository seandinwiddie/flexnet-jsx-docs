import { createEffect } from './createEffect.js';
import { EffectType } from './EffectType.js';

// Focus and scroll effects
export const focusEffect = (element) =>
    createEffect(EffectType.DOM, 'focus', { element });

export const scrollToEffect = (element, options = {}) =>
    createEffect(EffectType.DOM, 'scrollTo', { element, options });

// DOM ready effect
export const createDOMReadyEffect = () =>
    createEffect(EffectType.DOM, 'domReady', {}); 