import { curry } from '../../functions/composition.js';

// Conditional transformations
export const when = curry((predicate, transformer, element) =>
    predicate(element) 
        ? transformer(element)
        : element
);

export const unless = curry((predicate, transformer, element) =>
    when(element => !predicate(element), transformer, element)
);
