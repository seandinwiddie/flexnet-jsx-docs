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

// Import functions to make them available in this module's scope
import { Effect } from './functions/effect.js';
import { 
    setHTML,
    setText,
    addClass,
    removeClass,
    hasClass,
    setAttribute,
    setStyle 
} from './functions/domManipulation.js';
import { addEventListener, removeEventListener } from './functions/eventEffects.js';
import { httpGet, httpPost, httpPut, httpDelete } from './functions/httpEffects.js';
import { 
    setLocalStorage, 
    getLocalStorage, 
    removeLocalStorage 
} from './functions/storageEffects.js';
import { delay, timeout, interval } from './functions/timerEffects.js';
import { log, logError } from './functions/logEffects.js';

// Re-export the functions
export { 
    setHTML,
    setText,
    addClass,
    removeClass,
    hasClass,
    setAttribute,
    setStyle 
};
export { addEventListener, removeEventListener };
export { httpGet, httpPost, httpPut, httpDelete };
export { 
    setLocalStorage, 
    getLocalStorage, 
    removeLocalStorage 
};
export { delay, timeout, interval };
export { log, logError };

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
