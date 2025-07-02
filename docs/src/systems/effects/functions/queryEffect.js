import { createEffect } from './createEffect.js';
import { EffectType } from './EffectType.js';

// DOM query effects
export const queryEffect = (selector) =>
    createEffect(EffectType.DOM, 'query', { selector });

export const queryAllEffect = (selector) =>
    createEffect(EffectType.DOM, 'queryAll', { selector });

export const getElementByIdEffect = (id) =>
    createEffect(EffectType.DOM, 'getElementById', { id }); 