// === FlexNet Event Emitter State ===
// Simplified state management for event emitter

// ===========================================
// EMITTER STATE CREATION
// ===========================================

export const createEmitterState = (options = {}) => {
    return Object.freeze({
        listeners: new Map(),
        wildcardListeners: [],
        maxListeners: options.maxListeners || 10,
        trackHistory: options.trackHistory || false,
        eventHistory: options.trackHistory ? [] : null
    });
};
