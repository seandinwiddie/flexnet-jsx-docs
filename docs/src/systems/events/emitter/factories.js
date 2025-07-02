import { createEventEmitter } from './core.js';

// === FlexNet Event Emitter Factories ===
// Simplified factory functions for creating different types of emitters

// ===========================================
// SIMPLIFIED FACTORY FUNCTIONS
// ===========================================

export const createSimpleEmitter = () => {
    return createEventEmitter();
};

export const createWildcardEmitter = () => {
    return createEventEmitter({
        wildcardSupport: true
    });
};

export const createHistoryEmitter = () => {
    return createEventEmitter({
        trackHistory: true
    });
};

export const createNamespacedEmitter = (namespace) => {
    const emitter = createEventEmitter();
    
    // Wrap methods to add namespace
    const originalOn = emitter.on;
    const originalEmit = emitter.emit;
    
    return {
        ...emitter,
        on: (event, listener) => originalOn(`${namespace}:${event}`, listener),
        emit: (event, ...args) => originalEmit(`${namespace}:${event}`, ...args)
    };
};

// Default emitter instance for global use
export const defaultEmitter = createSimpleEmitter();
