// === FlexNet Effects System ===
// Complete side effect isolation and management

import Maybe from '../../core/types/maybe.js';
import Either from '../../core/types/either.js';
import Result from '../../core/types/result.js';
import { pipe } from '../../core/functions/composition.js';
import { sanitizeUrl } from '../../security/functions.js';

// Effect type definitions
export const EffectType = {
    DOM_QUERY: 'DOM_QUERY',
    DOM_MUTATE: 'DOM_MUTATE',
    HTTP_REQUEST: 'HTTP_REQUEST',
    TIMER: 'TIMER',
    EVENT_LISTENER: 'EVENT_LISTENER',
    CONSOLE_LOG: 'CONSOLE_LOG',
    LOCAL_STORAGE: 'LOCAL_STORAGE'
};

// Create effect container - pure function
export const createEffect = (type, operation, cleanup = null) => {
    if (!type || !operation) {
        return Either.Left('Effect type and operation are required');
    }

    if (typeof operation !== 'function') {
        return Either.Left('Effect operation must be a function');
    }

    const effect = Object.freeze({
        type,
        operation,
        cleanup: cleanup || (() => {}),
        id: generateEffectId(),
        timestamp: Date.now()
    });

    return Either.Right(effect);
};

// Effect execution with proper isolation
export const runEffect = (effect) => {
    if (!effect || typeof effect !== 'object') {
        return Either.Left('Invalid effect object');
    }

    return Result.fromTry(() => {
        return effect.operation();
    }).fold(
        error => Either.Left(`Effect execution failed: ${error.message}`),
        value => Either.Right(value)
    );
};

// DOM Query Effects - READ ONLY
export const query = (selector) => {
    const queryEffect = createEffect(EffectType.DOM_QUERY, () => {
        const element = document.querySelector(selector);
        return Maybe.fromNullable(element);
    });

    if (queryEffect.type === 'Left') {
        return queryEffect;
    }

    return runEffect(queryEffect.value);
};

export const queryAll = (selector) => {
    const queryAllEffect = createEffect(EffectType.DOM_QUERY, () => {
        return Array.from(document.querySelectorAll(selector));
    });

    if (queryAllEffect.type === 'Left') {
        return queryAllEffect;
    }

    return runEffect(queryAllEffect.value);
};

// DOM Mutation Effects - ISOLATED WRITES
export const safeSetHTML = (html) => (element) => {
    const mutationEffect = createEffect(EffectType.DOM_MUTATE, () => {
        if (!element) throw new Error('Element is null');
        
        element.innerHTML = '';
        const parsed = new DOMParser().parseFromString(html, 'text/html');
        Array.from(parsed.body.childNodes).forEach(node => {
            if (node) element.appendChild(node.cloneNode(true));
        });
        
        return element;
    });

    if (mutationEffect.type === 'Left') {
        return mutationEffect;
    }

    return runEffect(mutationEffect.value);
};

export const setTextContent = (text) => (element) => {
    const mutationEffect = createEffect(EffectType.DOM_MUTATE, () => {
        if (!element) throw new Error('Element is null');
        element.textContent = text;
        return element;
    });

    if (mutationEffect.type === 'Left') {
        return mutationEffect;
    }

    return runEffect(mutationEffect.value);
};

export const setAttribute = (key, value) => (element) => {
    const mutationEffect = createEffect(EffectType.DOM_MUTATE, () => {
        if (!element) throw new Error('Element is null');
        element.setAttribute(key, value);
        return element;
    });

    if (mutationEffect.type === 'Left') {
        return mutationEffect;
    }

    return runEffect(mutationEffect.value);
};

export const addClass = (className) => (element) => {
    const mutationEffect = createEffect(EffectType.DOM_MUTATE, () => {
        if (!element) throw new Error('Element is null');
        element.classList.add(className);
        return element;
    });

    if (mutationEffect.type === 'Left') {
        return mutationEffect;
    }

    return runEffect(mutationEffect.value);
};

export const removeClass = (className) => (element) => {
    const mutationEffect = createEffect(EffectType.DOM_MUTATE, () => {
        if (!element) throw new Error('Element is null');
        element.classList.remove(className);
        return element;
    });

    if (mutationEffect.type === 'Left') {
        return mutationEffect;
    }

    return runEffect(mutationEffect.value);
};

export const toggleClass = (className) => (element) => {
    const mutationEffect = createEffect(EffectType.DOM_MUTATE, () => {
        if (!element) throw new Error('Element is null');
        element.classList.toggle(className);
        return element;
    });

    if (mutationEffect.type === 'Left') {
        return mutationEffect;
    }

    return runEffect(mutationEffect.value);
};

// Event Listener Effects - ISOLATED EVENT HANDLING
export const addListener = (event, handler) => (element) => {
    const listenerEffect = createEffect(
        EffectType.EVENT_LISTENER,
        () => {
            if (!element) throw new Error('Element is null');
            element.addEventListener(event, handler);
            return element;
        },
        () => {
            if (element) {
                element.removeEventListener(event, handler);
            }
        }
    );

    if (listenerEffect.type === 'Left') {
        return listenerEffect;
    }

    return runEffect(listenerEffect.value);
};

export const removeListener = (event, handler) => (element) => {
    const removeEffect = createEffect(EffectType.EVENT_LISTENER, () => {
        if (!element) throw new Error('Element is null');
        element.removeEventListener(event, handler);
        return element;
    });

    if (removeEffect.type === 'Left') {
        return removeEffect;
    }

    return runEffect(removeEffect.value);
};

// Timer Effects - ISOLATED ASYNC OPERATIONS
export const delay = (ms) => {
    const timerEffect = createEffect(EffectType.TIMER, () => {
        return new Promise(resolve => setTimeout(resolve, ms));
    });

    if (timerEffect.type === 'Left') {
        return timerEffect;
    }

    return runEffect(timerEffect.value);
};

export const interval = (callback, ms) => {
    let intervalId = null;

    const intervalEffect = createEffect(
        EffectType.TIMER,
        () => {
            intervalId = setInterval(callback, ms);
            return intervalId;
        },
        () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        }
    );

    if (intervalEffect.type === 'Left') {
        return intervalEffect;
    }

    return runEffect(intervalEffect.value);
};

// HTTP Effects - ISOLATED NETWORK OPERATIONS
export const fetchResource = async (url) => {
    const httpEffect = createEffect(EffectType.HTTP_REQUEST, async () => {
        const urlValidation = sanitizeUrl(url);
        if (urlValidation.type === 'Left') {
            throw new Error(`Invalid URL: ${urlValidation.value}`);
        }

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Request failed for ${url}: ${response.statusText}`);
        }
        return await response.text();
    });

    if (httpEffect.type === 'Left') {
        return Either.Left(httpEffect.value);
    }

    try {
        const result = await runEffect(httpEffect.value);
        return result.fold(
            error => Either.Left(new Error(error)),
            value => Either.Right(value)
        );
    } catch (e) {
        console.error(`[fetchResource] A critical error occurred fetching ${url}:`, e);
        return Either.Left(e);
    }
};

// Console Effects - ISOLATED LOGGING
export const logInfo = (message, ...args) => {
    const logEffect = createEffect(EffectType.CONSOLE_LOG, () => {
        console.log(message, ...args);
        return message;
    });

    if (logEffect.type === 'Left') {
        return logEffect;
    }

    return runEffect(logEffect.value);
};

export const logError = (message, ...args) => {
    const logEffect = createEffect(EffectType.CONSOLE_LOG, () => {
        console.error(message, ...args);
        return message;
    });

    if (logEffect.type === 'Left') {
        return logEffect;
    }

    return runEffect(logEffect.value);
};

export const logWarn = (message, ...args) => {
    const logEffect = createEffect(EffectType.CONSOLE_LOG, () => {
        console.warn(message, ...args);
        return message;
    });

    if (logEffect.type === 'Left') {
        return logEffect;
    }

    return runEffect(logEffect.value);
};

// Local Storage Effects - ISOLATED STORAGE OPERATIONS
export const getFromStorage = (key) => {
    const storageEffect = createEffect(EffectType.LOCAL_STORAGE, () => {
        return Maybe.fromNullable(localStorage.getItem(key));
    });

    if (storageEffect.type === 'Left') {
        return storageEffect;
    }

    return runEffect(storageEffect.value);
};

export const setToStorage = (key, value) => {
    const storageEffect = createEffect(EffectType.LOCAL_STORAGE, () => {
        localStorage.setItem(key, value);
        return value;
    });

    if (storageEffect.type === 'Left') {
        return storageEffect;
    }

    return runEffect(storageEffect.value);
};

export const removeFromStorage = (key) => {
    const storageEffect = createEffect(EffectType.LOCAL_STORAGE, () => {
        localStorage.removeItem(key);
        return key;
    });

    if (storageEffect.type === 'Left') {
        return storageEffect;
    }

    return runEffect(storageEffect.value);
};

// Component Loading Effect - ISOLATED ASYNC COMPONENT LOADING
export const loadComponent = async (placeholderId, url) => {
    const result = await fetchResource(url);

    if (result.type === 'Left') {
        logWarn(`Error loading component ${url}:`, result.value);
        return Either.Left(result.value);
    }

    const html = result.value;
    const queryResult = query(`#${placeholderId}`);
    
    if (queryResult.type === 'Left') {
        return queryResult;
    }

    const maybePlaceholder = queryResult.value;
    
    if (maybePlaceholder.type === 'Nothing') {
        logWarn(`Placeholder element #${placeholderId} not found in the layout.`);
        return Either.Left(new Error('Placeholder not found'));
    }

    const element = maybePlaceholder.value;
    const htmlResult = safeSetHTML(html)(element);
    
    return htmlResult.fold(
        error => Either.Left(new Error(`Failed to set HTML: ${error}`)),
        value => Either.Right(value)
    );
};

// Effect Composition - Combine multiple effects
export const sequence = (effects) => {
    if (!Array.isArray(effects)) {
        return Either.Left('Effects must be an array');
    }

    const sequenceEffect = createEffect('SEQUENCE', () => {
        const results = [];
        for (const effect of effects) {
            const result = runEffect(effect);
            if (result.type === 'Left') {
                throw new Error(`Effect sequence failed: ${result.value}`);
            }
            results.push(result.value);
        }
        return results;
    });

    if (sequenceEffect.type === 'Left') {
        return sequenceEffect;
    }

    return runEffect(sequenceEffect.value);
};

// Parallel effect execution
export const parallel = async (effects) => {
    if (!Array.isArray(effects)) {
        return Either.Left('Effects must be an array');
    }

    try {
        const promises = effects.map(effect => {
            const result = runEffect(effect);
            return result.fold(
                error => Promise.reject(new Error(error)),
                value => Promise.resolve(value)
            );
        });

        const results = await Promise.all(promises);
        return Either.Right(results);
    } catch (error) {
        return Either.Left(`Parallel effect execution failed: ${error.message}`);
    }
};

// Generate unique effect ID
const generateEffectId = () => {
    return `effect_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Export all effect utilities
export const EffectUtils = {
    createEffect,
    runEffect,
    sequence,
    parallel,
    EffectType
};
