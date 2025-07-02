// === FlexNet Event System ===
// Pure functional event handling and composition
// Now organized into individual function modules

import Maybe from '../../core/types/maybe.js';
import Either from '../../core/types/either.js';
import Result from '../../core/types/result.js';
import { compose, pipe, curry } from '../../core/functions/composition.js';
import { ImmutableMap, ImmutableSet } from '../../utils/immutable.js';

// ===========================================
// CORE EVENT SYSTEM IMPORTS
// ===========================================

// Core event emitter
export { createEventEmitter } from './functions/createEventEmitter.js';

// DOM event handling
export { addDOMListener, removeDOMListener, getEventTarget } from './functions/domEventHandlers.js';

// Event delegation
export { 
    delegateEvent, 
    createDelegatedHandler, 
    removeDelegatedHandler 
} from './functions/eventDelegation.js';

// Event composition
export { 
    composeEventHandlers, 
    pipeEventHandlers, 
    combineEventHandlers 
} from './functions/eventComposition.js';

// Event filtering and transformation
export { 
    filterEvents, 
    transformEvent, 
    mapEventData 
} from './functions/eventFiltering.js';

// Event timing (debounce/throttle)
export { 
    debounceEvent, 
    throttleEvent, 
    delayEvent 
} from './functions/eventTiming.js';

// Event prevention
export { 
    preventDefault, 
    stopPropagation, 
    stopImmediatePropagation 
} from './functions/eventPrevention.js';

// Event validation
export { validateEvent, isValidEventType } from './functions/eventValidation.js';

// Custom events
export { 
    createCustomEvent, 
    dispatchCustomEvent, 
    isCustomEvent 
} from './functions/customEvents.js';

// Event bus
export { createEventBus } from './functions/eventBus.js';

// Keyboard handlers
export { createKeyboardHandler } from './functions/keyboardHandlers.js';

// Mouse handlers
export { getMousePosition, isInsideElement } from './functions/mouseHandlers.js';

// Event cleanup
export { createEventCleanup } from './functions/eventCleanup.js';

// ===========================================
// CONVENIENCE EXPORT OBJECT
// ===========================================

// Import for re-export in convenience object
import { createEventEmitter } from './functions/createEventEmitter.js';
import { addDOMListener, removeDOMListener } from './functions/domEventHandlers.js';
import { delegateEvent } from './functions/eventDelegation.js';
import { composeEventHandlers, pipeEventHandlers } from './functions/eventComposition.js';
import { filterEvents, transformEvent } from './functions/eventFiltering.js';
import { debounceEvent, throttleEvent } from './functions/eventTiming.js';
import { preventDefault, stopPropagation, stopImmediatePropagation } from './functions/eventPrevention.js';
import { validateEvent } from './functions/eventValidation.js';
import { createCustomEvent, dispatchCustomEvent } from './functions/customEvents.js';
import { createEventBus } from './functions/eventBus.js';
import { createKeyboardHandler } from './functions/keyboardHandlers.js';
import { getMousePosition, isInsideElement } from './functions/mouseHandlers.js';
import { createEventCleanup } from './functions/eventCleanup.js';
import { appEventBus, APP_EVENTS } from './appEventBus.js';

// Export event system utilities
export const EVENT_UTILS = Object.freeze({
    createEventEmitter,
    addDOMListener,
    removeDOMListener,
    delegateEvent,
    composeEventHandlers,
    pipeEventHandlers,
    filterEvents,
    transformEvent,
    debounceEvent,
    throttleEvent,
    preventDefault,
    stopPropagation,
    stopImmediatePropagation,
    validateEvent,
    createCustomEvent,
    dispatchCustomEvent,
    createEventBus,
    createKeyboardHandler,
    getMousePosition,
    isInsideElement,
    createEventCleanup,
    
    // Application Event Bus
    appEventBus,
    APP_EVENTS
});
