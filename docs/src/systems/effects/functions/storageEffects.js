// === Storage Effects ===
// Pure functional localStorage operations using Effect type
// All effects return Either<Error, Success> for proper error handling

import { Effect } from './effect.js';
import Either from '../../../core/types/either.js';
import Maybe from '../../../core/types/maybe.js';

/**
 * Pure effect to set an item in localStorage
 * @param {string} key - Storage key
 * @param {string} value - Value to store
 * @returns {Effect} Effect that returns Either<Error, StorageEntry>
 */
export const setLocalStorage = (key, value) =>
    Effect(() => {
        const validateKey = (k) =>
            typeof k === 'string' && k.trim()
                ? Either.Right(k.trim())
                : Either.Left('Storage key must be a non-empty string');

        const validateValue = (v) =>
            v !== null && v !== undefined
                ? Either.Right(String(v))
                : Either.Left('Storage value cannot be null or undefined');

        return Either.chain(validKey =>
            Either.chain(validValue => {
                try {
                    localStorage.setItem(validKey, validValue);
                    return Either.Right(Object.freeze({
                        key: validKey,
                        value: validValue,
                        timestamp: Date.now()
                    }));
                } catch (error) {
                    return Either.Left(`localStorage.setItem failed: ${error.message}`);
                }
            })(validateValue(value))
        )(validateKey(key));
    });

/**
 * Pure effect to get an item from localStorage
 * @param {string} key - Storage key
 * @returns {Effect} Effect that returns Either<Error, Maybe<string>>
 */
export const getLocalStorage = (key) =>
    Effect(() => {
        const validateKey = (k) =>
            typeof k === 'string' && k.trim()
                ? Either.Right(k.trim())
                : Either.Left('Storage key must be a non-empty string');

        return Either.chain(validKey => {
            try {
                const value = localStorage.getItem(validKey);
                return Either.Right(Maybe.fromNullable(value));
            } catch (error) {
                return Either.Left(`localStorage.getItem failed: ${error.message}`);
            }
        })(validateKey(key));
    });

/**
 * Pure effect to remove an item from localStorage
 * @param {string} key - Storage key
 * @returns {Effect} Effect that returns Either<Error, string>
 */
export const removeLocalStorage = (key) =>
    Effect(() => {
        const validateKey = (k) =>
            typeof k === 'string' && k.trim()
                ? Either.Right(k.trim())
                : Either.Left('Storage key must be a non-empty string');

        return Either.chain(validKey => {
            try {
                localStorage.removeItem(validKey);
                return Either.Right(validKey);
            } catch (error) {
                return Either.Left(`localStorage.removeItem failed: ${error.message}`);
            }
        })(validateKey(key));
    });

/**
 * Pure effect to clear all localStorage
 * @returns {Effect} Effect that returns Either<Error, Success>
 */
export const clearLocalStorage = () =>
    Effect(() => {
        try {
            localStorage.clear();
            return Either.Right('localStorage cleared successfully');
        } catch (error) {
            return Either.Left(`localStorage.clear failed: ${error.message}`);
        }
    });

/**
 * Pure effect to get localStorage length
 * @returns {Effect} Effect that returns Either<Error, number>
 */
export const getLocalStorageLength = () =>
    Effect(() => {
        try {
            const length = localStorage.length;
            return Either.Right(length);
        } catch (error) {
            return Either.Left(`localStorage.length failed: ${error.message}`);
        }
    });

/**
 * Pure effect to get a key by index from localStorage
 * @param {number} index - Index of the key
 * @returns {Effect} Effect that returns Either<Error, Maybe<string>>
 */
export const getLocalStorageKeyByIndex = (index) =>
    Effect(() => {
        const validateIndex = (idx) =>
            typeof idx === 'number' && idx >= 0 && Number.isInteger(idx)
                ? Either.Right(idx)
                : Either.Left('Index must be a non-negative integer');

        return Either.chain(validIndex => {
            try {
                const key = localStorage.key(validIndex);
                return Either.Right(Maybe.fromNullable(key));
            } catch (error) {
                return Either.Left(`localStorage.key failed: ${error.message}`);
            }
        })(validateIndex(index));
    });

/**
 * Pure effect to get all localStorage keys
 * @returns {Effect} Effect that returns Either<Error, Array<string>>
 */
export const getAllLocalStorageKeys = () =>
    Effect(() => {
        try {
            const keys = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key !== null) {
                    keys.push(key);
                }
            }
            return Either.Right(Object.freeze(keys));
        } catch (error) {
            return Either.Left(`Failed to get localStorage keys: ${error.message}`);
        }
    });

/**
 * Pure effect to check if a key exists in localStorage
 * @param {string} key - Storage key to check
 * @returns {Effect} Effect that returns Either<Error, boolean>
 */
export const hasLocalStorageKey = (key) =>
    Effect(() => {
        const validateKey = (k) =>
            typeof k === 'string' && k.trim()
                ? Either.Right(k.trim())
                : Either.Left('Storage key must be a non-empty string');

        return Either.chain(validKey => {
            try {
                const value = localStorage.getItem(validKey);
                return Either.Right(value !== null);
            } catch (error) {
                return Either.Left(`localStorage key check failed: ${error.message}`);
            }
        })(validateKey(key));
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