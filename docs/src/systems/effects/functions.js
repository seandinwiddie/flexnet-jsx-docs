// === FlexNet Effects System ===
// Comprehensive side effect isolation with pure functional interfaces

import Maybe from '../../core/types/maybe.js';
import Either from '../../core/types/either.js';
import Result from '../../core/types/result.js';
import { compose, pipe, curry } from '../../core/functions/composition.js';
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
            throw new Error('Invalid effect object');
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
                throw new Error(`Unknown effect type: ${effect.type}`);
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
                return payload.element;
            }
            throw new Error('Invalid element for setTextContent');

        case 'setHTML':
            if (payload.element && payload.element.nodeType) {
                payload.element.innerHTML = escapeHTML(payload.html);
                return payload.element;
            }
            throw new Error('Invalid element for setHTML');

        case 'setAttribute':
            if (payload.element && payload.element.setAttribute) {
                payload.element.setAttribute(payload.name, payload.value);
                return payload.element;
            }
            throw new Error('Invalid element for setAttribute');

        case 'removeAttribute':
            if (payload.element && payload.element.removeAttribute) {
                payload.element.removeAttribute(payload.name);
                return payload.element;
            }
            throw new Error('Invalid element for removeAttribute');

        case 'addClass':
            if (payload.element && payload.element.classList) {
                payload.element.classList.add(payload.className);
                return payload.element;
            }
            throw new Error('Invalid element for addClass');

        case 'removeClass':
            if (payload.element && payload.element.classList) {
                payload.element.classList.remove(payload.className);
                return payload.element;
            }
            throw new Error('Invalid element for removeClass');

        case 'setStyle':
            if (payload.element && payload.element.style) {
                payload.element.style[payload.property] = payload.value;
                return payload.element;
            }
            throw new Error('Invalid element for setStyle');

        case 'addEventListener':
            if (payload.element && payload.element.addEventListener) {
                payload.element.addEventListener(payload.event, payload.handler, payload.options);
                return () => payload.element.removeEventListener(payload.event, payload.handler, payload.options);
            }
            throw new Error('Invalid element for addEventListener');

        case 'removeEventListener':
            if (payload.element && payload.element.removeEventListener) {
                payload.element.removeEventListener(payload.event, payload.handler, payload.options);
                return true;
            }
            throw new Error('Invalid element for removeEventListener');

        case 'createElement':
            return document.createElement(payload.tagName);

        case 'appendChild':
            if (payload.parent && payload.child && payload.parent.appendChild) {
                payload.parent.appendChild(payload.child);
                return payload.parent;
            }
            throw new Error('Invalid elements for appendChild');

        case 'removeChild':
            if (payload.parent && payload.child && payload.parent.removeChild) {
                payload.parent.removeChild(payload.child);
                return payload.parent;
            }
            throw new Error('Invalid elements for removeChild');

        case 'focus':
            if (payload.element && payload.element.focus) {
                payload.element.focus();
                return payload.element;
            }
            throw new Error('Invalid element for focus');

        case 'scrollTo':
            if (payload.element && payload.element.scrollTo) {
                payload.element.scrollTo(payload.options);
                return payload.element;
            }
            throw new Error('Invalid element for scrollTo');

        default:
            throw new Error(`Unknown DOM operation: ${operation}`);
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
    
    // Validate URL
    const urlValidation = sanitizeURL(payload.url);
    if (urlValidation.type === 'Left') {
        throw new Error(`Invalid URL: ${urlValidation.value}`);
    }

    const requestOptions = {
        method: operation.toUpperCase(),
        headers: {
            'Content-Type': 'application/json',
            ...payload.options.headers
        },
        ...payload.options
    };

    if (payload.body && (operation === 'post' || operation === 'put')) {
        requestOptions.body = typeof payload.body === 'string' 
            ? payload.body 
            : JSON.stringify(payload.body);
    }

    try {
        const response = await fetch(payload.url, requestOptions);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const contentType = response.headers.get('content-type');
        let data;

        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        return {
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries()),
            data
        };
    } catch (error) {
        throw new Error(`HTTP request failed: ${error.message}`);
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
            return true;

        case 'getLocalStorage':
            const localValue = localStorage.getItem(payload.key);
            return localValue ? JSON.parse(localValue) : null;

        case 'removeLocalStorage':
            localStorage.removeItem(payload.key);
            return true;

        case 'clearLocalStorage':
            localStorage.clear();
            return true;

        case 'setSessionStorage':
            sessionStorage.setItem(payload.key, JSON.stringify(payload.value));
            return true;

        case 'getSessionStorage':
            const sessionValue = sessionStorage.getItem(payload.key);
            return sessionValue ? JSON.parse(sessionValue) : null;

        default:
            throw new Error(`Unknown storage operation: ${operation}`);
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
            return setTimeout(payload.callback, payload.delay);

        case 'setInterval':
            return setInterval(payload.callback, payload.interval);

        case 'clearTimeout':
            clearTimeout(payload.timeoutId);
            return true;

        case 'clearInterval':
            clearInterval(payload.intervalId);
            return true;

        default:
            throw new Error(`Unknown timer operation: ${operation}`);
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
            return Math.random() * (payload.max - payload.min) + payload.min;

        case 'integer':
            return Math.floor(Math.random() * (payload.max - payload.min + 1)) + payload.min;

        case 'uuid':
            return crypto.randomUUID();

        default:
            throw new Error(`Unknown random operation: ${operation}`);
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
            return Date.now();

        case 'getDate':
            return new Date();

        case 'formatDate':
            return new Intl.DateTimeFormat(navigator.language, payload.format).format(payload.date);

        default:
            throw new Error(`Unknown datetime operation: ${operation}`);
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
    const timestamp = new Date().toISOString();

    switch (operation) {
        case 'log':
            const logMessage = `[${timestamp}] ${payload.message}`;
            switch (payload.level) {
                case 'error':
                    console.error(logMessage);
                    break;
                case 'warn':
                    console.warn(logMessage);
                    break;
                case 'debug':
                    console.debug(logMessage);
                    break;
                default:
                    console.info(logMessage);
            }
            return true;

        case 'error':
            console.error(`[${timestamp}] ERROR:`, payload.error, payload.context);
            return true;

        default:
            throw new Error(`Unknown log operation: ${operation}`);
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
            return new Promise((resolve, reject) => {
                if (!navigator.geolocation) {
                    reject(new Error('Geolocation not supported'));
                    return;
                }

                navigator.geolocation.getCurrentPosition(
                    position => resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy
                    }),
                    error => reject(new Error(`Geolocation error: ${error.message}`)),
                    payload.options
                );
            });

        case 'notification':
            if (!('Notification' in window)) {
                throw new Error('Notifications not supported');
            }

            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                return new Notification(payload.title, payload.options);
            } else {
                throw new Error('Notification permission denied');
            }

        default:
            throw new Error(`Unknown browser API operation: ${operation}`);
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
            return requestAnimationFrame(payload.callback);

        case 'cancelAnimationFrame':
            cancelAnimationFrame(payload.id);
            return true;

        default:
            throw new Error(`Unknown animation operation: ${operation}`);
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
            return await payload.asyncFunction();

        default:
            throw new Error(`Unknown async operation: ${operation}`);
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
