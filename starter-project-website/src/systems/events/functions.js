// Event system implementation
import Maybe from '../../core/types/maybe.js';

const createEventBus = () => {
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
        },
        off: (event, callback) => {
            const subs = subscribers.get(event);
            if (subs) {
                subs.delete(callback);
                if (subs.size === 0) {
                    subscribers.delete(event);
                }
            }
        },
        clear: () => subscribers.clear()
    };
};

export { createEventBus }; 