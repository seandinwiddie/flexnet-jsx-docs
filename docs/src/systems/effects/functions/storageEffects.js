// === Storage Effects Module ===
// Side effect functions for browser storage operations

import { createEffect } from './createEffect.js';
import { EffectType } from './EffectType.js';

/**
 * Creates an effect to set a value in localStorage
 * @param {string} key - The storage key
 * @param {*} value - The value to store
 * @returns {Effect} Storage effect object
 */
export const setLocalStorageEffect = (key, value) =>
    createEffect(EffectType.STORAGE, 'setLocalStorage', { key, value });

/**
 * Creates an effect to get a value from localStorage
 * @param {string} key - The storage key to retrieve
 * @returns {Effect} Storage effect object
 */
export const getLocalStorageEffect = (key) =>
    createEffect(EffectType.STORAGE, 'getLocalStorage', { key });

/**
 * Creates an effect to remove a value from localStorage
 * @param {string} key - The storage key to remove
 * @returns {Effect} Storage effect object
 */
export const removeLocalStorageEffect = (key) =>
    createEffect(EffectType.STORAGE, 'removeLocalStorage', { key });

/**
 * Creates an effect to clear all localStorage
 * @returns {Effect} Storage effect object
 */
export const clearLocalStorageEffect = () =>
    createEffect(EffectType.STORAGE, 'clearLocalStorage', {});

/**
 * Creates an effect to set a value in sessionStorage
 * @param {string} key - The storage key
 * @param {*} value - The value to store
 * @returns {Effect} Storage effect object
 */
export const setSessionStorageEffect = (key, value) =>
    createEffect(EffectType.STORAGE, 'setSessionStorage', { key, value });

/**
 * Creates an effect to get a value from sessionStorage
 * @param {string} key - The storage key to retrieve
 * @returns {Effect} Storage effect object
 */
export const getSessionStorageEffect = (key) =>
    createEffect(EffectType.STORAGE, 'getSessionStorage', { key }); 