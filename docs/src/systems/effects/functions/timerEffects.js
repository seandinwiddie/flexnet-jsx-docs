// === Timer Effects ===
// Pure functional timer operations using Effect type

import { Effect } from './effect.js';

export const delay = (ms) =>
    Effect.of(() => 
        new Promise(resolve => setTimeout(resolve, ms))
    );

export const timeout = (callback, ms) =>
    Effect.of(() => {
        const timeoutId = setTimeout(callback, ms);
        return timeoutId;
    });

export const interval = (callback, ms) =>
    Effect.of(() => {
        const intervalId = setInterval(callback, ms);
        return intervalId;
    }); 