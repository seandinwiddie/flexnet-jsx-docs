import Maybe from '../../core/types/maybe.js';
import { compose } from '../../core/functions/composition.js';

export const increment = n => n + 1;
export const decrement = n => n - 1;
export const updateCount = (count, operation) =>
  Maybe.fromNullable(count)
    .map(operation)
    .getOrElse(0); 