// === FlexNet Event System ===
// Pure functional event handling matching documented API
// Individual functions in separate files, this is just the root import/export

// Core Event Bus
export { createEventBus } from './functions/createEventBus.js';

// Legacy compatibility - simple event utilities
export { createEventEmitter } from './functions/createEventEmitter.js';

// Application Event Bus instance for compatibility
import { createEventBus } from './functions/createEventBus.js';

export const appEventBus = createEventBus();

export const APP_EVENTS = {
    THEME_CHANGE_REQUESTED: 'THEME_CHANGE_REQUESTED',
    THEME_CHANGED: 'THEME_CHANGED',
    SIDEBAR_TOGGLE_REQUESTED: 'SIDEBAR_TOGGLE_REQUESTED',
    SIDEBAR_OPENED: 'SIDEBAR_OPENED',
    SIDEBAR_CLOSED: 'SIDEBAR_CLOSED',
    COMPONENT_INITIALIZED: 'COMPONENT_INITIALIZED',
    COMPONENT_ERROR: 'COMPONENT_ERROR',
    APP_READY: 'APP_READY',
    APP_ERROR: 'APP_ERROR'
};
