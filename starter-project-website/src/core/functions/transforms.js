// Functional array transformations
const map = fn => array => array.map(fn);
const filter = predicate => array => array.filter(predicate);
const reduce = (fn, initial) => array => array.reduce(fn, initial);
 
export { map, filter, reduce }; 