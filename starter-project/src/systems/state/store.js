// Immutable state store implementation
const createStore = (initialState) => {
    const subscribers = new Set();
    let state = initialState;

    return {
        getState: () => state,
        update: (updater) => {
            state = updater(state);
            subscribers.forEach(subscriber => subscriber(state));
            return state;
        },
        subscribe: (subscriber) => {
            subscribers.add(subscriber);
            // Return unsubscribe function
            return () => subscribers.delete(subscriber);
        }
    };
};

export { createStore }; 