// === Storage Effects ===
// Pure functional localStorage operations using Effect type

import { Effect } from './effect.js';
import Either from '../../../core/types/either.js';
import Maybe from '../../../core/types/maybe.js';

export const setLocalStorage = (key, value) =>
    Effect.of(() => {
        try {
            localStorage.setItem(key, value);
            return Either.Right({ key, value });
        } catch (error) {
            return Either.Left(`localStorage.setItem failed: ${error.message}`);
        }
    });

export const getLocalStorage = (key) =>
    Effect.of(() => {
        try {
            const value = localStorage.getItem(key);
            return Maybe.fromNullable(value);
        } catch (error) {
            return Maybe.Nothing();
        }
    });

export const removeLocalStorage = (key) =>
    Effect.of(() => {
        try {
            localStorage.removeItem(key);
            return Either.Right(key);
        } catch (error) {
            return Either.Left(`localStorage.removeItem failed: ${error.message}`);
        }
    });

/**
 * Creates an effect to clear all localStorage
 * @returns {Effect} Storage effect object
 */
export const clearLocalStorageEffect = () =>
    Effect.of(() => {
        try {
            localStorage.clear();
            return Either.Right({});
        } catch (error) {
            return Either.Left(`localStorage.clear failed: ${error.message}`);
        }
    });

/**
 * Creates an effect to set a value in sessionStorage
 * @param {string} key - The storage key
 * @param {*} value - The value to store
 * @returns {Effect} Storage effect object
 */
export const setSessionStorageEffect = (key, value) =>
    Effect.of(() => {
        try {
            sessionStorage.setItem(key, value);
            return Either.Right({ key, value });
        } catch (error) {
            return Either.Left(`sessionStorage.setItem failed: ${error.message}`);
        }
    });

/**
 * Creates an effect to get a value from sessionStorage
 * @param {string} key - The storage key to retrieve
 * @returns {Effect} Storage effect object
 */
export const getSessionStorageEffect = (key) =>
    Effect.of(() => {
        try {
            const value = sessionStorage.getItem(key);
            return Maybe.fromNullable(value);
        } catch (error) {
            return Maybe.Nothing();
        }
    }); 