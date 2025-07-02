// === FlexNet Effects System ===
// Comprehensive side effect isolation with pure functional interfaces

import Maybe from '../../core/types/maybe.js';
import Either from '../../core/types/either.js';
import Result from '../../core/types/result.js';
import { compose, pipe, curry } from '../../core/functions/composition.js';
import { ImmutableMap, ImmutableSet, deepFreeze } from '../../utils/immutable.js';
import { sanitizeURL } from '../../security/xss.js';
import { escapeHTML } from '../../security/xss.js';

// ===========================================
// EFFECT TYPES AND EXECUTION ENGINE
// ===========================================

// Effect type definitions
export const EffectType = Object.freeze({
    DOM: 'dom',
    HTTP: 'http',
    STORAGE: 'storage',
    TIMER: 'timer',
    RANDOM: 'random',
    DATETIME: 'datetime',
    LOG: 'log',
    BROWSER_API: 'browser_api',
    ANIMATION: 'animation',
    ASYNC: 'async'
});

// Core Effect structure
export const createEffect = (type, operation, payload = {}) =>
    Object.freeze({
        type,
        operation,
        payload: Object.freeze(payload),
        timestamp: Date.now(),
        _isEffect: true
    });

// Effect execution engine
export const executeEffect = (effect) =>
    Result.fromTry(() => {
        if (!effect || !effect._isEffect) {
            return Either.Left('Invalid effect object');
        }

        switch (effect.type) {
            case EffectType.DOM:
                return executeDOMEffect(effect);
            case EffectType.HTTP:
                return executeHTTPEffect(effect);
            case EffectType.STORAGE:
                return executeStorageEffect(effect);
            case EffectType.TIMER:
                return executeTimerEffect(effect);
            case EffectType.RANDOM:
                return executeRandomEffect(effect);
            case EffectType.DATETIME:
                return executeDateTimeEffect(effect);
            case EffectType.LOG:
                return executeLogEffect(effect);
            case EffectType.BROWSER_API:
                return executeBrowserAPIEffect(effect);
            case EffectType.ANIMATION:
                return executeAnimationEffect(effect);
            case EffectType.ASYNC:
                return executeAsyncEffect(effect);
            default:
                return Either.Left(`Unknown effect type: ${effect.type}`);
        }
    });

// ===========================================
// DOM EFFECTS
// ===========================================

// DOM query effects
export const queryEffect = (selector) =>
    createEffect(EffectType.DOM, 'query', { selector });

export const queryAllEffect = (selector) =>
    createEffect(EffectType.DOM, 'queryAll', { selector });

export const getElementByIdEffect = (id) =>
    createEffect(EffectType.DOM, 'getElementById', { id });

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

export const setStyleEffect = (element, property, value) =>
    createEffect(EffectType.DOM, 'setStyle', { element, property, value });

// DOM event effects
export const addEventListenerEffect = (element, event, handler, options = {}) =>
    createEffect(EffectType.DOM, 'addEventListener', { element, event, handler, options });

export const removeEventListenerEffect = (element, event, handler, options = {}) =>
    createEffect(EffectType.DOM, 'removeEventListener', { element, event, handler, options });

// DOM creation effects
export const createElementEffect = (tagName) =>
    createEffect(EffectType.DOM, 'createElement', { tagName });

export const appendChildEffect = (parent, child) =>
    createEffect(EffectType.DOM, 'appendChild', { parent, child });

export const removeChildEffect = (parent, child) =>
    createEffect(EffectType.DOM, 'removeChild', { parent, child });

// Focus and scroll effects
export const focusEffect = (element) =>
    createEffect(EffectType.DOM, 'focus', { element });

export const scrollToEffect = (element, options = {}) =>
    createEffect(EffectType.DOM, 'scrollTo', { element, options });

// DOM effect executor
const executeDOMEffect = (effect) => {
    const { operation, payload } = effect;

    switch (operation) {
        case 'query':
            return Maybe.fromNullable(document.querySelector(payload.selector));

        case 'queryAll':
            return Array.from(document.querySelectorAll(payload.selector));

        case 'getElementById':
            return Maybe.fromNullable(document.getElementById(payload.id));

        case 'setTextContent':
            if (payload.element && payload.element.nodeType) {
                payload.element.textContent = escapeHTML(payload.text);
                return Either.Right(payload.element);
            }
            return Either.Left('Invalid element for setTextContent');

        case 'setHTML':
            if (payload.element && payload.element.nodeType) {
                payload.element.innerHTML = escapeHTML(payload.html);
                return Either.Right(payload.element);
            }
            return Either.Left('Invalid element for setHTML');

        case 'setAttribute':
            if (payload.element && payload.element.setAttribute) {
                payload.element.setAttribute(payload.name, payload.value);
                return Either.Right(payload.element);
            }
            return Either.Left('Invalid element for setAttribute');

        case 'removeAttribute':
            if (payload.element && payload.element.removeAttribute) {
                payload.element.removeAttribute(payload.name);
                return Either.Right(payload.element);
            }
            return Either.Left('Invalid element for removeAttribute');

        case 'addClass':
            if (payload.element && payload.element.classList) {
                payload.element.classList.add(payload.className);
                return Either.Right(payload.element);
            }
            return Either.Left('Invalid element for addClass');

        case 'removeClass':
            if (payload.element && payload.element.classList) {
                payload.element.classList.remove(payload.className);
                return Either.Right(payload.element);
            }
            return Either.Left('Invalid element for removeClass');

        case 'setStyle':
            if (payload.element && payload.element.style) {
                payload.element.style[payload.property] = payload.value;
                return Either.Right(payload.element);
            }
            return Either.Left('Invalid element for setStyle');

        case 'addEventListener':
            if (payload.element && payload.element.addEventListener) {
                payload.element.addEventListener(payload.event, payload.handler, payload.options);
                return Either.Right(() => payload.element.removeEventListener(payload.event, payload.handler, payload.options));
            }
            return Either.Left('Invalid element for addEventListener');

        case 'removeEventListener':
            if (payload.element && payload.element.removeEventListener) {
                payload.element.removeEventListener(payload.event, payload.handler, payload.options);
                return Either.Right(payload.element);
            }
            return Either.Left('Invalid element for removeEventListener');

        case 'createElement':
            return Either.Right(document.createElement(payload.tagName));

        case 'appendChild':
            if (payload.parent && payload.child && payload.parent.appendChild) {
                payload.parent.appendChild(payload.child);
                return Either.Right(payload.parent);
            }
            return Either.Left('Invalid elements for appendChild');

        case 'removeChild':
            if (payload.parent && payload.child && payload.parent.removeChild) {
                payload.parent.removeChild(payload.child);
                return Either.Right(payload.parent);
            }
            return Either.Left('Invalid elements for removeChild');

        case 'focus':
            if (payload.element && payload.element.focus) {
                payload.element.focus();
                return Either.Right(payload.element);
            }
            return Either.Left('Invalid element for focus');

        case 'scrollTo':
            if (payload.element && payload.element.scrollIntoView) {
                payload.element.scrollIntoView(payload.options);
                return Either.Right(payload.element);
            }
            return Either.Left('Invalid element for scrollTo');

        default:
            return Either.Left(`Unknown DOM operation: ${operation}`);
    }
};

// ===========================================
// HTTP EFFECTS
// ===========================================

export const httpGetEffect = (url, options = {}) =>
    createEffect(EffectType.HTTP, 'get', { url, options });

export const httpPostEffect = (url, body, options = {}) =>
    createEffect(EffectType.HTTP, 'post', { url, body, options });

export const httpPutEffect = (url, body, options = {}) =>
    createEffect(EffectType.HTTP, 'put', { url, body, options });

export const httpDeleteEffect = (url, options = {}) =>
    createEffect(EffectType.HTTP, 'delete', { url, options });

const executeHTTPEffect = async (effect) => {
    const { operation, payload } = effect;
    const { url, options = {} } = payload;

    // Validate URL using existing sanitizer
    const urlValidation = sanitizeURL(url);
    if (urlValidation.type === 'Left') {
        return Either.Left(`Invalid URL: ${urlValidation.value}`);
    }

    const config = {
        method: operation.toUpperCase(),
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    };

    if (payload.body && (operation === 'post' || operation === 'put')) {
        config.body = typeof payload.body === 'string' 
            ? payload.body 
            : JSON.stringify(payload.body);
    }

    try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
            return Either.Left(`HTTP ${response.status}: ${response.statusText}`);
        }

        const contentType = response.headers.get('content-type');
        let data;

        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        return Either.Right({
            data,
            status: response.status,
            headers: response.headers,
            url: response.url
        });

    } catch (error) {
        return Either.Left(`HTTP request failed: ${error.message || 'Unknown error'}`);
    }
};

// ===========================================
// STORAGE EFFECTS
// ===========================================

export const setLocalStorageEffect = (key, value) =>
    createEffect(EffectType.STORAGE, 'setLocalStorage', { key, value });

export const getLocalStorageEffect = (key) =>
    createEffect(EffectType.STORAGE, 'getLocalStorage', { key });

export const removeLocalStorageEffect = (key) =>
    createEffect(EffectType.STORAGE, 'removeLocalStorage', { key });

export const clearLocalStorageEffect = () =>
    createEffect(EffectType.STORAGE, 'clearLocalStorage', {});

export const setSessionStorageEffect = (key, value) =>
    createEffect(EffectType.STORAGE, 'setSessionStorage', { key, value });

export const getSessionStorageEffect = (key) =>
    createEffect(EffectType.STORAGE, 'getSessionStorage', { key });

const executeStorageEffect = (effect) => {
    const { operation, payload } = effect;

    switch (operation) {
        case 'setLocalStorage':
            localStorage.setItem(payload.key, JSON.stringify(payload.value));
            return Either.Right(payload.value);

        case 'getLocalStorage':
            const item = localStorage.getItem(payload.key);
            return item !== null ? Either.Right(JSON.parse(item)) : Maybe.Nothing();

        case 'removeLocalStorage':
            localStorage.removeItem(payload.key);
            return Either.Right(true);

        case 'clearLocalStorage':
            localStorage.clear();
            return Either.Right(true);

        case 'setSessionStorage':
            sessionStorage.setItem(payload.key, JSON.stringify(payload.value));
            return Either.Right(payload.value);

        case 'getSessionStorage':
            const sessionItem = sessionStorage.getItem(payload.key);
            return sessionItem !== null ? Either.Right(JSON.parse(sessionItem)) : Maybe.Nothing();

        default:
            return Either.Left(`Unknown storage operation: ${operation}`);
    }
};

// ===========================================
// TIMER EFFECTS
// ===========================================

export const setTimeoutEffect = (callback, delay) =>
    createEffect(EffectType.TIMER, 'setTimeout', { callback, delay });

export const setIntervalEffect = (callback, interval) =>
    createEffect(EffectType.TIMER, 'setInterval', { callback, interval });

export const clearTimeoutEffect = (timeoutId) =>
    createEffect(EffectType.TIMER, 'clearTimeout', { timeoutId });

export const clearIntervalEffect = (intervalId) =>
    createEffect(EffectType.TIMER, 'clearInterval', { intervalId });

const executeTimerEffect = (effect) => {
    const { operation, payload } = effect;

    switch (operation) {
        case 'setTimeout':
            return Either.Right(setTimeout(payload.callback, payload.delay));

        case 'setInterval':
            return Either.Right(setInterval(payload.callback, payload.interval));

        case 'clearTimeout':
            clearTimeout(payload.timeoutId);
            return Either.Right(true);

        case 'clearInterval':
            clearInterval(payload.intervalId);
            return Either.Right(true);

        default:
            return Either.Left(`Unknown timer operation: ${operation}`);
    }
};

// ===========================================
// RANDOM EFFECTS
// ===========================================

export const randomNumberEffect = (min = 0, max = 1) =>
    createEffect(EffectType.RANDOM, 'number', { min, max });

export const randomIntegerEffect = (min, max) =>
    createEffect(EffectType.RANDOM, 'integer', { min, max });

export const randomUUIDEffect = () =>
    createEffect(EffectType.RANDOM, 'uuid', {});

const executeRandomEffect = (effect) => {
    const { operation, payload } = effect;

    switch (operation) {
        case 'number':
            return Either.Right(Math.random() * (payload.max - payload.min) + payload.min);

        case 'integer':
            return Either.Right(Math.floor(Math.random() * (payload.max - payload.min + 1)) + payload.min);

        case 'uuid':
            // Simple UUID generation using crypto API
            const crypto = window.crypto || window.msCrypto;
            if (crypto && crypto.getRandomValues) {
                const buffer = crypto.getRandomValues(Uint8Array.from({ length: 16 }));
                const hex = Array.from(buffer, byte => byte.toString(16).padStart(2, '0')).join('');
                const uuid = `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
                return Either.Right(uuid);
            }
            return Either.Left('Crypto API not available');

        default:
            return Either.Left(`Unknown random operation: ${operation}`);
    }
};

// ===========================================
// DATETIME EFFECTS
// ===========================================

export const getCurrentTimeEffect = () =>
    createEffect(EffectType.DATETIME, 'getCurrentTime', {});

export const getDateEffect = () =>
    createEffect(EffectType.DATETIME, 'getDate', {});

export const formatDateEffect = (date, format) =>
    createEffect(EffectType.DATETIME, 'formatDate', { date, format });

const executeDateTimeEffect = (effect) => {
    const { operation, payload } = effect;

    switch (operation) {
        case 'getCurrentTime':
            return Either.Right(Date.now());

        case 'getDate':
            return Either.Right(Date.now());

        case 'formatDate':
            const formatter = globalThis.Intl?.DateTimeFormat?.(navigator.language, payload.format);
            return formatter 
                ? Either.Right(formatter.format(payload.date))
                : Either.Left('Date formatting not available');

        default:
            return Either.Left(`Unknown datetime operation: ${operation}`);
    }
};

// ===========================================
// LOGGING EFFECTS
// ===========================================

export const logEffect = (message, level = 'info') =>
    createEffect(EffectType.LOG, 'log', { message, level });

export const logErrorEffect = (error, context = {}) =>
    createEffect(EffectType.LOG, 'error', { error, context });

const executeLogEffect = (effect) => {
    const { operation, payload } = effect;

    switch (operation) {
        case 'log':
            const timestamp = Date.now();
            const logEntry = `[${timestamp}] ${payload.level.toUpperCase()}: ${payload.message}`;
            
            switch (payload.level) {
                case 'debug':
                    console.debug(logEntry);
                    break;
                case 'info':
                    console.info(logEntry);
                    break;
                case 'warn':
                    console.warn(logEntry);
                    break;
                case 'error':
                    console.error(logEntry);
                    break;
                default:
                    console.log(logEntry);
            }
            return Either.Right(logEntry);

        case 'error':
            const errorMessage = payload.error?.message || String(payload.error || 'Unknown error');
            const contextStr = Object.keys(payload.context).length > 0 
                ? ` Context: ${JSON.stringify(payload.context)}`
                : '';
            const fullErrorMessage = `Error: ${errorMessage}${contextStr}`;
            console.error(fullErrorMessage);
            return Either.Right(fullErrorMessage);

        default:
            return Either.Left(`Unknown log operation: ${operation}`);
    }
};

// ===========================================
// BROWSER API EFFECTS
// ===========================================

export const getGeolocationEffect = (options = {}) =>
    createEffect(EffectType.BROWSER_API, 'geolocation', { options });

export const showNotificationEffect = (title, options = {}) =>
    createEffect(EffectType.BROWSER_API, 'notification', { title, options });

const executeBrowserAPIEffect = async (effect) => {
    const { operation, payload } = effect;

    switch (operation) {
        case 'geolocation':
            if (!navigator.geolocation) {
                return Either.Left('Geolocation not supported');
            }
            
            return Either.fromPromise(
                new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(
                        position => resolve(position),
                        error => reject(`Geolocation error: ${error.message || 'Unknown error'}`),
                        payload.options
                    );
                })
            );

        case 'notification':
            if (!('Notification' in window)) {
                return Either.Left('Notifications not supported');
            }

            if (Notification.permission === 'granted') {
                const notification = Notification.from({
                    title: payload.title,
                    ...payload.options
                });
                return Either.Right(notification);
            } else if (Notification.permission !== 'denied') {
                const permission = await Notification.requestPermission();
                if (permission === 'granted') {
                    const notification = Notification.from({
                        title: payload.title,
                        ...payload.options
                    });
                    return Either.Right(notification);
                }
            }
            return Either.Left('Notification permission denied');

        default:
            return Either.Left(`Unknown browser API operation: ${operation}`);
    }
};

// ===========================================
// ANIMATION EFFECTS
// ===========================================

export const requestAnimationFrameEffect = (callback) =>
    createEffect(EffectType.ANIMATION, 'requestAnimationFrame', { callback });

export const cancelAnimationFrameEffect = (id) =>
    createEffect(EffectType.ANIMATION, 'cancelAnimationFrame', { id });

const executeAnimationEffect = (effect) => {
    const { operation, payload } = effect;

    switch (operation) {
        case 'requestAnimationFrame':
            return Either.Right(requestAnimationFrame(payload.callback));

        case 'cancelAnimationFrame':
            cancelAnimationFrame(payload.id);
            return Either.Right(true);

        default:
            return Either.Left(`Unknown animation operation: ${operation}`);
    }
};

// ===========================================
// ASYNC EFFECTS
// ===========================================

export const createAsyncEffect = (asyncFunction) =>
    createEffect(EffectType.ASYNC, 'execute', { asyncFunction });

const executeAsyncEffect = async (effect) => {
    const { operation, payload } = effect;

    switch (operation) {
        case 'execute':
            if (typeof payload.asyncFunction !== 'function') {
                return Either.Left('Async effect requires a function');
            }
            
            try {
                const result = await payload.asyncFunction();
                return Either.Right(result);
            } catch (error) {
                return Either.Left(error?.message || String(error || 'Async operation failed'));
            }

        default:
            return Either.Left(`Unknown async operation: ${operation}`);
    }
};

// ===========================================
// EFFECT COMPOSITION AND UTILITIES
// ===========================================

// Chain multiple effects
export const chainEffects = (...effects) =>
    effects.reduce(async (prevPromise, effect) => {
        await prevPromise;
        return executeEffect(effect);
    }, Promise.resolve());

// Run effects in parallel
export const parallelEffects = (...effects) =>
    Promise.all(effects.map(executeEffect));

// Effect error handling
export const safeExecuteEffect = (effect) =>
    executeEffect(effect)
        .then(result => Result.Ok(result))
        .catch(error => Result.Error(error));

// Effect batching
export const batchEffects = (effects) =>
    Result.fromTry(() => effects.map(executeEffect));

// Export all effect utilities
export const EFFECT_UTILS = Object.freeze({
    EffectType,
    createEffect,
    executeEffect,
    chainEffects,
    parallelEffects,
    safeExecuteEffect,
    batchEffects
});
