// Array utility functions
import Maybe from '../core/types/maybe.js';

const head = array =>
    Maybe.fromNullable(array[0]);

const tail = array =>
    array.length > 1 ? Maybe.Just(array.slice(1)) : Maybe.Nothing();

const find = predicate => array =>
    Maybe.fromNullable(array.find(predicate));

const isEmpty = array => array.length === 0;

const safeGet = index => array =>
    Maybe.fromNullable(array[index]);

export { head, tail, find, isEmpty, safeGet }; 