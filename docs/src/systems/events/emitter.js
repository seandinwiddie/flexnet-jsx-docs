// === FlexNet Event Emitter ===
// Pure functional event emitter with immutable state and type safety

// Import all emitter modules
import { 
    createListener, 
    validateListener, 
    validateEventName 
} from './emitter/validation.js';

import { createEmitterState } from './emitter/state.js';

import { 
    createOnFunction, 
    createOnceFunction, 
    createOffFunction, 
    createRemoveAllListenersFunction 
} from './emitter/listeners.js';

import { 
    matchesPattern, 
    createGetListenersForEventFunction, 
    createEmitFunction 
} from './emitter/emission.js';

import {
    createListenerCountFunction,
    createEventNamesFunction,
    createHasListenersFunction,
    createGetStatsFunction,
    createGetEventHistoryFunction,
    createClearEventHistoryFunction,
    createDebugFunction
} from './emitter/utilities.js';

import { createEventEmitter } from './emitter/core.js';

import {
    createSimpleEmitter,
    createWildcardEmitter,
    createHistoryEmitter,
    createNamespacedEmitter,
    defaultEmitter
} from './emitter/factories.js';

// Re-export all functions for backwards compatibility
export {
    // Core event emitter
    createEventEmitter,
    
    // Validation utilities
    createListener,
    validateListener,
    validateEventName,
    
    // State management
    createEmitterState,
    
    // Listener management functions
    createOnFunction,
    createOnceFunction,
    createOffFunction,
    createRemoveAllListenersFunction,
    
    // Emission utilities
    matchesPattern,
    createGetListenersForEventFunction,
    createEmitFunction,
    
    // Utility functions
    createListenerCountFunction,
    createEventNamesFunction,
    createHasListenersFunction,
    createGetStatsFunction,
    createGetEventHistoryFunction,
    createClearEventHistoryFunction,
    createDebugFunction,
    
    // Factory functions
    createSimpleEmitter,
    createWildcardEmitter,
    createHistoryEmitter,
    createNamespacedEmitter,
    defaultEmitter
};
