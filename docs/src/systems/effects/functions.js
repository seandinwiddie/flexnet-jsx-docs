// === FlexNet Effects System ===
// Pure functional effect system following documented API
// Individual functions in separate files, this is just the root import/export

// Core Effect Type
export { Effect } from './functions/effect.js';

// Basic Effect Operations  
export { executeEffect } from './functions/executeEffect.js';
export { chainEffects } from './functions/chainEffects.js';
export { parallelEffects } from './functions/parallelEffects.js';

// DOM Query Effects
export { query, queryAll } from './functions/domQuery.js';

// DOM Manipulation Effects
export { 
    setHTML,
    setText,
    addClass,
    removeClass,
    hasClass,
    setAttribute,
    setStyle 
} from './functions/domManipulation.js';

// Event Effects
export { addEventListener, removeEventListener } from './functions/eventEffects.js';

// HTTP Effects
export { httpGet, httpPost, httpPut, httpDelete } from './functions/httpEffects.js';

// Storage Effects
export { 
    setLocalStorage, 
    getLocalStorage, 
    removeLocalStorage 
} from './functions/storageEffects.js';

// Timer Effects
export { delay, timeout, interval } from './functions/timerEffects.js';

// Log Effects
export { log, logError } from './functions/logEffects.js';

// Utility Effects
export { loadComponent, fetchResource, safeSetHTML } from './functions/utilityEffects.js';

// Legacy compatibility aliases
export const setHTMLEffect = setHTML;
export const addClassEffect = addClass;
export const removeClassEffect = removeClass;
export const hasClassEffect = hasClass;
export const setStyleEffect = setStyle;
export const addEventListenerEffect = addEventListener;
export const removeEventListenerEffect = removeEventListener;
export const setLocalStorageEffect = setLocalStorage;
export const getLocalStorageEffect = getLocalStorage;
export const createDelayEffect = delay;
export const logEffect = log;
export const createDOMReadyEffect = (callback) => Effect.of(() => {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback);
    } else {
        callback();
    }
});
