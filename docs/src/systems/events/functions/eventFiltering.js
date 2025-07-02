import { curry } from '../../../core/functions/composition.js';

// Event filtering and transformation
export const filterEvents = curry((predicate, handler) =>
    (event) => {
        if (predicate(event)) {
            return handler(event);
        }
        return null;
    }
);

export const transformEvent = curry((transformer, handler) =>
    (event) => {
        try {
            const transformedEvent = transformer(event);
            return handler(transformedEvent);
        } catch (error) {
            console.error('Event transformation error:', error);
            return handler(event); // Fallback to original event
        }
    }
); 