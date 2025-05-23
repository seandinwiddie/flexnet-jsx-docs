import { createElement, render } from '../../core/runtime/jsx.js';
import Maybe from '../../core/types/maybe.js';
import { compose } from '../../core/functions/composition.js';

// Pure functions
const increment = n => n + 1;
const decrement = n => n - 1;

// Simple state management
const createStore = (initialState) => {
    const subscribers = new Set();
    let state = initialState;

    return {
        getState: () => state,
        update: (updater) => {
            state = updater(state);
            subscribers.forEach(subscriber => subscriber(state));
        },
        subscribe: (subscriber) => {
            subscribers.add(subscriber);
            return () => subscribers.delete(subscriber);
        }
    };
};

// Create store with Maybe type
const store = createStore(Maybe.Just(0));

// Counter component as pure function
const Counter = ({ count, onIncrement, onDecrement }) => {
    const safeCount = count.getOrElse(0);
    
    return createElement('div', { 
        style: 'display: flex; align-items: center; justify-content: center; margin: 20px;' 
    }, [
        createElement('button', { 
            onClick: onDecrement,
            style: 'font-size: 16px; padding: 5px 10px; margin: 5px; cursor: pointer;'
        }, '-'),
        createElement('span', { 
            style: 'font-size: 24px; margin: 0 15px; min-width: 40px; text-align: center;' 
        }, String(safeCount)),
        createElement('button', { 
            onClick: onIncrement,
            style: 'font-size: 16px; padding: 5px 10px; margin: 5px; cursor: pointer;'
        }, '+')
    ]);
};

// Initialize counter
const initCounter = (containerId) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Subscribe to state changes and render
    store.subscribe(count => {
        render(
            Counter({
                count,
                onIncrement: () => store.update(count => count.map(increment)),
                onDecrement: () => store.update(count => count.map(decrement))
            }),
            container
        );
    });

    // Initial render
    store.update(count => count);
};

export default initCounter; 