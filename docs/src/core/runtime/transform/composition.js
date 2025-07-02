import Maybe from '../../types/maybe.js';

// Composition helpers for chaining transformations
export const composeTransforms = (...transforms) =>
    element => transforms.reduce((acc, transform) => 
        Maybe.fromNullable(acc)
            .chain(transform)
            .getOrElse(acc)
    , element);

export const pipeTransforms = (...transforms) =>
    element => transforms.reduce((acc, transform) =>
        Maybe.fromNullable(acc)
            .chain(transform)
            .getOrElse(acc)
    , element);
