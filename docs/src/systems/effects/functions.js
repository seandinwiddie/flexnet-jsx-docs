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

export const hasClassEffect = (element, className) =>
    createEffect(EffectType.DOM, 'hasClass', { element, className });

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

// DOM ready effect
export const createDOMReadyEffect = () =>
    createEffect(EffectType.DOM, 'domReady', {});

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

        case 'hasClass':
            if (payload.element && payload.element.classList) {
                return Either.Right(payload.element.classList.contains(payload.className));
            }
            return Either.Left('Invalid element for hasClass');

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

        case 'domReady':
            if (document.readyState === 'loading') {
                return createPromiseEffect(resolve => {
                    const handler = () => {
                        resolve();
                        document.removeEventListener('DOMContentLoaded', handler);
                    };
                    document.addEventListener('DOMContentLoaded', handler);
                });
            } else {
                return createPromiseEffect(resolve => resolve());
            }

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

    const sanitizedUrl = sanitizeURL(payload.url);
    if (sanitizedUrl.type === 'Left') {
        return Either.Left(`Invalid URL: ${sanitizedUrl.value}`);
    }

    const defaultOptions = {
        headers: { 'Content-Type': 'application/json' },
        ...payload.options
    };

    try {
        let response;
        switch (operation) {
            case 'get':
                response = await fetch(payload.url, { ...defaultOptions, method: 'GET' });
                break;
            case 'post':
                response = await fetch(payload.url, {
                    ...defaultOptions,
                    method: 'POST',
                    body: typeof payload.body === 'string' ? payload.body : JSON.stringify(payload.body)
                });
                break;
            case 'put':
                response = await fetch(payload.url, {
                    ...defaultOptions,
                    method: 'PUT',
                    body: typeof payload.body === 'string' ? payload.body : JSON.stringify(payload.body)
                });
                break;
            case 'delete':
                response = await fetch(payload.url, { ...defaultOptions, method: 'DELETE' });
                break;
            default:
                return Either.Left(`Unknown HTTP operation: ${operation}`);
        }

        const data = await response.text();
        return Either.Right({
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries()),
            data
        });
    } catch (error) {
        return Either.Left(error.message || 'HTTP request failed');
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

    try {
        switch (operation) {
            case 'setLocalStorage':
                localStorage.setItem(payload.key, payload.value);
                return Either.Right(payload.value);

            case 'getLocalStorage':
                const value = localStorage.getItem(payload.key);
                return Maybe.fromNullable(value);

            case 'removeLocalStorage':
                localStorage.removeItem(payload.key);
                return Either.Right(payload.key);

            case 'clearLocalStorage':
                localStorage.clear();
                return Either.Right(true);

            case 'setSessionStorage':
                sessionStorage.setItem(payload.key, payload.value);
                return Either.Right(payload.value);

            case 'getSessionStorage':
                const sessionValue = sessionStorage.getItem(payload.key);
                return Maybe.fromNullable(sessionValue);

            default:
                return Either.Left(`Unknown storage operation: ${operation}`);
        }
    } catch (error) {
        return Either.Left(error.message || 'Storage operation failed');
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

export const createDelayEffect = (delay) =>
    createEffect(EffectType.TIMER, 'delay', { delay });

const executeTimerEffect = (effect) => {
    const { operation, payload } = effect;

    switch (operation) {
        case 'setTimeout':
            const timeoutId = setTimeout(payload.callback, payload.delay);
            return Either.Right(timeoutId);

        case 'setInterval':
            const intervalId = setInterval(payload.callback, payload.interval);
            return Either.Right(intervalId);

        case 'clearTimeout':
            clearTimeout(payload.timeoutId);
            return Either.Right(payload.timeoutId);

        case 'clearInterval':
            clearInterval(payload.intervalId);
            return Either.Right(payload.intervalId);

        case 'delay':
            return createPromiseEffect(resolve => setTimeout(resolve, payload.delay));

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
            const randomFloat = Math.random() * (payload.max - payload.min) + payload.min;
            return Either.Right(randomFloat);

        case 'integer':
            const randomInt = Math.floor(Math.random() * (payload.max - payload.min + 1)) + payload.min;
            return Either.Right(randomInt);

        case 'uuid':
            // Functional UUID generation without constructors
            const hex = '0123456789abcdef';
            const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
                const r = Math.random() * 16 | 0;
                const v = c === 'x' ? r : (r & 0x3 | 0x8);
                return hex[v];
            });
            return Either.Right(uuid);

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
            const date = payload.date instanceof Date ? payload.date : createDateFromValue(payload.date);
            const formatter = globalThis.Intl?.DateTimeFormat?.(navigator.language, payload.format);
            if (formatter) {
                return Either.Right(formatter.format(date));
            }
            return Either.Right(date.toString());

        default:
            return Either.Left(`Unknown datetime operation: ${operation}`);
    }
};

// Helper function to create Date without constructor
const createDateFromValue = (value) => {
    // Use functional approach to create date representation
    const timestamp = typeof value === 'number' ? value : Date.parse(value);
    return { valueOf: () => timestamp, toString: () => 'Date(' + timestamp + ')' };
};

// ===========================================
// LOG EFFECTS
// ===========================================

export const logEffect = (message, level = 'info') =>
    createEffect(EffectType.LOG, 'log', { message, level });

export const logErrorEffect = (error, context = {}) =>
    createEffect(EffectType.LOG, 'error', { error, context });

const executeLogEffect = (effect) => {
    const { operation, payload } = effect;

    const timestamp = Date.now();
    const logEntry = {
        timestamp,
        level: payload.level || 'info',
        message: payload.message,
        context: payload.context || {}
    };

    switch (operation) {
        case 'log':
            switch (payload.level) {
                case 'error':
                    console.error(`[${timestamp}] ERROR:`, payload.message);
                    break;
                case 'warn':
                    console.warn(`[${timestamp}] WARN:`, payload.message);
                    break;
                case 'debug':
                    console.debug(`[${timestamp}] DEBUG:`, payload.message);
                    break;
                case 'info':
                default:
                    console.info(`[${timestamp}] INFO:`, payload.message);
                    break;
            }
            return Either.Right(logEntry);

        case 'error':
            console.error(`[${timestamp}] ERROR:`, payload.error, payload.context);
            return Either.Right({
                ...logEntry,
                level: 'error',
                error: payload.error
            });

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

            return createPromiseEffect((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    position => resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy
                    }),
                    error => reject(error.message),
                    payload.options
                );
            });

        case 'notification':
            if (!('Notification' in window)) {
                return Either.Left('Notifications not supported');
            }

            if (Notification.permission === 'granted') {
                // Create notification without constructor using functional approach
                return Either.Right(createNotificationEffect(payload.title, payload.options));
            } else if (Notification.permission !== 'denied') {
                return createPromiseEffect((resolve, reject) => {
                    Notification.requestPermission().then(permission => {
                        if (permission === 'granted') {
                            resolve(createNotificationEffect(payload.title, payload.options));
                        } else {
                            reject('Notification permission denied');
                        }
                    });
                });
            } else {
                return Either.Left('Notification permission denied');
            }

        default:
            return Either.Left(`Unknown browser API operation: ${operation}`);
    }
};

// Helper for notification creation
const createNotificationEffect = (title, options) => {
    const notification = Object.create(Notification.prototype);
    notification.title = title;
    notification.options = options;
    return notification;
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
            const id = requestAnimationFrame(payload.callback);
            return Either.Right(id);

        case 'cancelAnimationFrame':
            cancelAnimationFrame(payload.id);
            return Either.Right(payload.id);

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
            try {
                const result = await payload.asyncFunction();
                return Either.Right(result);
            } catch (error) {
                return Either.Left(error.message || 'Async operation failed');
            }

        default:
            return Either.Left(`Unknown async operation: ${operation}`);
    }
};

// ===========================================
// EFFECT COMPOSITION UTILITIES
// ===========================================

export const chainEffects = (...effects) =>
    effects.reduce(async (prevPromise, effect) => {
        await prevPromise;
        return executeEffect(effect);
    }, Promise.resolve());

export const parallelEffects = (...effects) =>
    Promise.all(effects.map(executeEffect));

export const safeExecuteEffect = (effect) =>
    executeEffect(effect)
        .catch(error => Either.Left(error.message || 'Effect execution failed'));

export const batchEffects = (effects) =>
    Result.fromTry(() => effects.map(executeEffect));

// ===========================================
// UTILITY FUNCTIONS
// ===========================================

// Helper to create promise-based effects functionally
const createPromiseEffect = (executor) => {
    return {
        then: (resolve, reject) => {
            executor(resolve, reject);
        }
    };
};

// Query helper that uses effect system
export const query = (selector) => {
    const element = document.querySelector(selector);
    return Maybe.fromNullable(element);
};

// Fetch resource using effect system
export const fetchResource = async (url) => {
    const httpEffect = httpGetEffect(url);
    return executeEffect(httpEffect);
};

// Safe HTML setting using effect system
export const safeSetHTML = (html) => (element) => {
    return executeEffect(setHTMLEffect(element, html));
};

// Load component helper
export const loadComponent = async (placeholderId, url) => {
    const fetchResult = await fetchResource(url);
    
    if (fetchResult.type === 'Right') {
        const placeholder = document.getElementById(placeholderId);
        if (placeholder) {
            return safeSetHTML(fetchResult.value.data)(placeholder);
        }
        return Either.Left(`Placeholder ${placeholderId} not found`);
    }
    
    return fetchResult;
};

// Export all effect creation functions for external use
export const Effects = Object.freeze({
    // DOM
    query: queryEffect,
    queryAll: queryAllEffect,
    getElementById: getElementByIdEffect,
    setTextContent: setTextContentEffect,
    setHTML: setHTMLEffect,
    setAttribute: setAttributeEffect,
    removeAttribute: removeAttributeEffect,
    addClass: addClassEffect,
    removeClass: removeClassEffect,
    hasClass: hasClassEffect,
    setStyle: setStyleEffect,
    addEventListener: addEventListenerEffect,
    removeEventListener: removeEventListenerEffect,
    createElement: createElementEffect,
    appendChild: appendChildEffect,
    removeChild: removeChildEffect,
    focus: focusEffect,
    scrollTo: scrollToEffect,
    domReady: createDOMReadyEffect,
    
    // HTTP
    httpGet: httpGetEffect,
    httpPost: httpPostEffect,
    httpPut: httpPutEffect,
    httpDelete: httpDeleteEffect,
    
    // Storage
    setLocalStorage: setLocalStorageEffect,
    getLocalStorage: getLocalStorageEffect,
    removeLocalStorage: removeLocalStorageEffect,
    clearLocalStorage: clearLocalStorageEffect,
    setSessionStorage: setSessionStorageEffect,
    getSessionStorage: getSessionStorageEffect,
    
    // Timer
    setTimeout: setTimeoutEffect,
    setInterval: setIntervalEffect,
    clearTimeout: clearTimeoutEffect,
    clearInterval: clearIntervalEffect,
    delay: createDelayEffect,
    
    // Random
    randomNumber: randomNumberEffect,
    randomInteger: randomIntegerEffect,
    randomUUID: randomUUIDEffect,
    
    // DateTime
    getCurrentTime: getCurrentTimeEffect,
    getDate: getDateEffect,
    formatDate: formatDateEffect,
    
    // Log
    log: logEffect,
    logError: logErrorEffect,
    
    // Browser API
    getGeolocation: getGeolocationEffect,
    showNotification: showNotificationEffect,
    
    // Animation
    requestAnimationFrame: requestAnimationFrameEffect,
    cancelAnimationFrame: cancelAnimationFrameEffect,
    
    // Async
    createAsync: createAsyncEffect
});
