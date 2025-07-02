// === Create Event Emitter ===
// Simple event emitter for compatibility

export const createEventEmitter = () => {
    const events = new Map();
    
    return {
        on: (event, listener) => {
            if (!events.has(event)) {
                events.set(event, new Set());
            }
            events.get(event).add(listener);
            return () => events.get(event)?.delete(listener);
        },
        emit: (event, ...args) => {
            if (events.has(event)) {
                events.get(event).forEach(listener => listener(...args));
            }
        },
        off: (event, listener) => {
            if (events.has(event)) {
                events.get(event).delete(listener);
            }
        }
    };
}; 