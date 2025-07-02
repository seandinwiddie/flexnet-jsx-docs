// === FlexNet Effects System ===
// Comprehensive side effect isolation with pure functional interfaces
// Fully modularized effect system following FlexNet architecture standards

import Maybe from '../../core/types/maybe.js';
import Either from '../../core/types/either.js';
import Result from '../../core/types/result.js';
import { compose, pipe, curry } from '../../core/functions/composition.js';
import { ImmutableMap, ImmutableSet, deepFreeze } from '../../utils/immutable.js';
import { sanitizeURL } from '../../security/xss.js';
import { escapeHTML } from '../../security/xss.js';

// ===========================================
// CORE EFFECT SYSTEM EXPORTS
// ===========================================

// Core effect types and functions
export { EffectType } from './functions/EffectType.js';
export { createEffect } from './functions/createEffect.js';
export { executeEffect } from './functions/executeEffect.js';

// Executor functions (internal use)
export { executeDOMEffect } from './functions/executeDOMEffect.js';
export { executeHTTPEffect } from './functions/executeHTTPEffect.js';
export { executeStorageEffect } from './functions/executeStorageEffect.js';
export { executeTimerEffect } from './functions/executeTimerEffect.js';
export { executeRandomEffect } from './functions/executeRandomEffect.js';
export { executeDateTimeEffect } from './functions/executeDateTimeEffect.js';
export { executeLogEffect } from './functions/executeLogEffect.js';
export { executeBrowserAPIEffect } from './functions/executeBrowserAPIEffect.js';
export { executeAnimationEffect } from './functions/executeAnimationEffect.js';
export { executeAsyncEffect } from './functions/executeAsyncEffect.js';

// ===========================================
// DOM EFFECTS EXPORTS
// ===========================================

// DOM query effects
export { queryEffect, queryAllEffect, getElementByIdEffect } from './functions/queryEffect.js';

// DOM manipulation effects
export {
    setTextContentEffect,
    setHTMLEffect,
    setAttributeEffect,
    removeAttributeEffect,
    addClassEffect,
    removeClassEffect,
    hasClassEffect,
    setStyleEffect
} from './functions/domManipulationEffects.js';

// DOM event effects
export { addEventListenerEffect, removeEventListenerEffect } from './functions/domEventEffects.js';

// DOM creation effects
export { createElementEffect, appendChildEffect, removeChildEffect } from './functions/domCreationEffects.js';

// DOM focus and scroll effects
export { focusEffect, scrollToEffect, createDOMReadyEffect } from './functions/domFocusScrollEffects.js';

// ===========================================
// HTTP EFFECTS EXPORTS
// ===========================================

export { httpGetEffect, httpPostEffect, httpPutEffect, httpDeleteEffect } from './functions/httpEffects.js';

// ===========================================
// STORAGE EFFECTS EXPORTS
// ===========================================

export {
    setLocalStorageEffect,
    getLocalStorageEffect,
    removeLocalStorageEffect,
    clearLocalStorageEffect,
    setSessionStorageEffect,
    getSessionStorageEffect
} from './functions/storageEffects.js';

// ===========================================
// TIMER EFFECTS EXPORTS
// ===========================================

export {
    setTimeoutEffect,
    setIntervalEffect,
    clearTimeoutEffect,
    clearIntervalEffect,
    createDelayEffect
} from './functions/timerEffects.js';

// ===========================================
// RANDOM EFFECTS EXPORTS
// ===========================================

export {
    randomNumberEffect,
    randomIntegerEffect,
    randomUUIDEffect
} from './functions/randomEffects.js';

// ===========================================
// DATETIME EFFECTS EXPORTS
// ===========================================

export {
    getCurrentTimeEffect,
    getDateEffect,
    formatDateEffect
} from './functions/dateTimeEffects.js';

// ===========================================
// LOG EFFECTS EXPORTS
// ===========================================

export {
    logEffect,
    logErrorEffect
} from './functions/logEffects.js';

// ===========================================
// BROWSER API EFFECTS EXPORTS
// ===========================================

export {
    getGeolocationEffect,
    showNotificationEffect
} from './functions/browserAPIEffects.js';

// ===========================================
// ANIMATION EFFECTS EXPORTS
// ===========================================

export {
    requestAnimationFrameEffect,
    cancelAnimationFrameEffect
} from './functions/animationEffects.js';

// ===========================================
// ASYNC EFFECTS EXPORTS
// ===========================================

export {
    createAsyncEffect
} from './functions/asyncEffects.js';

// ===========================================
// EFFECT COMPOSITION EXPORTS
// ===========================================

export {
    chainEffects,
    parallelEffects,
    safeExecuteEffect,
    batchEffects
} from './functions/effectComposition.js';

// ===========================================
// UTILITY FUNCTIONS
// ===========================================

/**
 * Query helper that uses effect system
 * @param {string} selector - CSS selector
 * @returns {Maybe} Maybe containing the element
 */
export const query = (selector) => {
    const element = document.querySelector(selector);
    return Maybe.fromNullable(element);
};

/**
 * Fetch resource using effect system
 * @param {string} url - URL to fetch
 * @returns {Promise<Either>} Either containing response or error
 */
export const fetchResource = async (url) => {
    const { httpGetEffect } = await import('./functions/httpEffects.js');
    const { executeEffect } = await import('./functions/executeEffect.js');
    const httpEffect = httpGetEffect(url);
    return executeEffect(httpEffect);
};

/**
 * Safe HTML setting using effect system
 * @param {string} html - HTML content to set
 * @returns {Function} Function that takes element and returns Promise
 */
export const safeSetHTML = (html) => (element) => {
    const { setHTMLEffect } = require('./functions/domManipulationEffects.js');
    const { executeEffect } = require('./functions/executeEffect.js');
    return executeEffect(setHTMLEffect(element, html));
};

/**
 * Load component helper using effect system
 * @param {string} placeholderId - ID of placeholder element
 * @param {string} componentUrl - URL of component to load
 * @returns {Promise<Either>} Either containing success or error result
 */
export const loadComponent = async (placeholderId, componentUrl) => {
    try {
        const placeholder = query(`#${placeholderId}`);
        
        if (placeholder.type === 'Nothing') {
            return Either.Left(`Placeholder element '${placeholderId}' not found`);
        }
        
        const response = await fetchResource(componentUrl);
        
        return response.fold(
            error => Either.Left(`Failed to load component: ${error}`),
            async (html) => {
                const element = placeholder.getOrElse(null);
                if (element) {
                    await safeSetHTML(html)(element);
                    return Either.Right(`Component '${placeholderId}' loaded successfully`);
                }
                return Either.Left(`Failed to render component: ${placeholderId}`);
            }
        );
    } catch (error) {
        return Either.Left(`Component loading error: ${error.message}`);
    }
};
