// === Core Function Composition ===
// Essential functional programming composition utilities

// Compose functions right to left: f(g(x))
export const compose = (...fns) => x => fns.reduceRight((y, f) => f(y), x);

// Pipe functions left to right: g(f(x))
export const pipe = (...fns) => x => fns.reduce((y, f) => f(y), x);

// Curry a function to enable partial application
export const curry = fn => (...args) =>
    args.length >= fn.length ? fn(...args) : curry(fn.bind(null, ...args));
