// === Create Event Bus ===
// Matches the documented event system API exactly

import Maybe from '../../../core/types/maybe.js';

export const createEventBus = () => {
    const subscribers = new Map();
    
    return {
        emit: (event, data) =>
            Maybe.fromNullable(subscribers.get(event))
                .map(subs => subs.forEach(fn => fn(data))),
        on: (event, callback) => {
            const subs = subscribers.get(event) || new Set();
            subs.add(callback);
            subscribers.set(event, subs);
            return () => subs.delete(callback);
        }
    };
}; 