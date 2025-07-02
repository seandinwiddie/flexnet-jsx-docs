import { createEffect } from './createEffect.js';
import { EffectType } from './EffectType.js';

// DOM manipulation effects
export const setTextContentEffect = (element, text) =>
    createEffect(EffectType.DOM, 'setTextContent', { element, text });

export const setHTMLEffect = (element, html) =>
    createEffect(EffectType.DOM, 'setHTML', { element, html });

export const setAttributeEffect = (element, name, value) =>
    createEffect(EffectType.DOM, 'setAttribute', { element, name, value });

export const removeAttributeEffect = (element, name) =>
    createEffect(EffectType.DOM, 'removeAttribute', { element, name });

export const addClassEffect = (element, className) =>
    createEffect(EffectType.DOM, 'addClass', { element, className });

export const removeClassEffect = (element, className) =>
    createEffect(EffectType.DOM, 'removeClass', { element, className });

export const hasClassEffect = (element, className) =>
    createEffect(EffectType.DOM, 'hasClass', { element, className });

export const setStyleEffect = (element, property, value) =>
    createEffect(EffectType.DOM, 'setStyle', { element, property, value }); 