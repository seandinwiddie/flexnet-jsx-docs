import { createEffect } from './createEffect.js';
import { EffectType } from './EffectType.js';

export const httpGetEffect = (url, options = {}) =>
    createEffect(EffectType.HTTP, 'get', { url, options });

export const httpPostEffect = (url, body, options = {}) =>
    createEffect(EffectType.HTTP, 'post', { url, body, options });

export const httpPutEffect = (url, body, options = {}) =>
    createEffect(EffectType.HTTP, 'put', { url, body, options });

export const httpDeleteEffect = (url, options = {}) =>
    createEffect(EffectType.HTTP, 'delete', { url, options }); 