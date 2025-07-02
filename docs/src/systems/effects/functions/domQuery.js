// === DOM Query Effects ===
// Pure functional DOM querying using Effect type

import { Effect } from './effect.js';
import Maybe from '../../../core/types/maybe.js';

export const query = (selector) =>
    Effect.of(() => {
        const element = document.querySelector(selector);
        return Maybe.fromNullable(element);
    });

export const queryAll = (selector) =>
    Effect.of(() => {
        const elements = document.querySelectorAll(selector);
        return Array.from(elements);
    }); 