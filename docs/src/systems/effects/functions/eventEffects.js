// === Event Effects ===
// Pure functional event handling using Effect type

import { Effect } from './effect.js';
import Either from '../../../core/types/either.js';

export const addEventListener = (element, event, handler) =>
    Effect.of(() => {
        if (!element) return Either.Left('Element is null');
        element.addEventListener(event, handler);
        return Either.Right({ element, event, handler });
    });

export const removeEventListener = (element, event, handler) =>
    Effect.of(() => {
        if (!element) return Either.Left('Element is null');
        element.removeEventListener(event, handler);
        return Either.Right({ element, event, handler });
    }); 