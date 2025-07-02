import { createEffect } from './createEffect.js';
import { EffectType } from './EffectType.js';

// DOM creation effects
export const createElementEffect = (tagName) =>
    createEffect(EffectType.DOM, 'createElement', { tagName });

export const appendChildEffect = (parent, child) =>
    createEffect(EffectType.DOM, 'appendChild', { parent, child });

export const removeChildEffect = (parent, child) =>
    createEffect(EffectType.DOM, 'removeChild', { parent, child }); 