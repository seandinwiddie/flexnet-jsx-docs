// === Create Store Function ===
// Matches the documented createStore API exactly

export const createStore = (reducer, initialState) => {
    const subscribers = new Set();
    let state = initialState;
    
    return {
        getState: () => state,
        dispatch: action => {
            const newState = reducer(state, action);
            state = newState;
            subscribers.forEach(fn => fn());
        },
        subscribe: fn => {
            subscribers.add(fn);
            return () => subscribers.delete(fn);
        }
    };
}; 