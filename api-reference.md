# FlexNet JSX API Reference

Version: 1.0.0 (Released 2025-01-31)

## Core Types

### Maybe Type
```javascript
// src/core/types/maybe.js
const Maybe = {
    Just: value => ({ type: 'Just', value }),
    Nothing: () => ({ type: 'Nothing' }),
    fromNullable: value => value != null ? Maybe.Just(value) : Maybe.Nothing(),
    map: fn => maybe => 
        maybe.type === 'Just' ? Maybe.Just(fn(maybe.value)) : Maybe.Nothing(),
    chain: fn => maybe =>
        maybe.type === 'Just' ? fn(maybe.value) : Maybe.Nothing(),
    getOrElse: defaultValue => maybe =>
        maybe.type === 'Just' ? maybe.value : defaultValue
};
```

### Either Type
```javascript
// src/core/types/either.js
const Either = {
    Left: value => ({ type: 'Left', value }),
    Right: value => ({ type: 'Right', value }),
    fromNullable: value => value != null ? Either.Right(value) : Either.Left('Value is null'),
    map: fn => either =>
        either.type === 'Right' ? Either.Right(fn(either.value)) : either,
    chain: fn => either =>
        either.type === 'Right' ? fn(either.value) : either,
    fold: (leftFn, rightFn) => either =>
        either.type === 'Right' ? rightFn(either.value) : leftFn(either.value)
};
```

### Result Type
```javascript
// src/core/types/result.js
const Result = {
    Ok: value => ({ type: 'Ok', value }),
    Error: error => ({ type: 'Error', error }),
    fromTry: fn => {
        try {
            return Result.Ok(fn());
        } catch (e) {
            return Result.Error(e);
        }
    },
    map: fn => result =>
        result.type === 'Ok' ? Result.Ok(fn(result.value)) : result,
    chain: fn => result =>
        result.type === 'Ok' ? fn(result.value) : result
};
```

## Core Functions

### Composition
```javascript
// src/core/functions/composition.js
const compose = (...fns) => x => fns.reduceRight((y, f) => f(y), x);
const pipe = (...fns) => x => fns.reduce((y, f) => f(y), x);
const curry = fn => (...args) =>
    args.length >= fn.length ? fn(...args) : curry(fn.bind(null, ...args));
```

### Transforms
```javascript
// src/core/functions/transforms.js
const map = fn => array => array.map(fn);
const filter = predicate => array => array.filter(predicate);
const reduce = (fn, initial) => array => array.reduce(fn, initial);
```

## System APIs

### Render System
```javascript
// src/systems/render/functions.js
const createElement = (type, props, ...children) => ({
    type,
    props: { ...props, children: children.flat() }
});

const render = (element, container) =>
    pipe(
        createVirtualDOM,
        reconcile(container.firstChild),
        patch(container)
    )(element);
```

### State System
```javascript
// src/systems/state/functions.js
const createStore = (reducer, initialState) => {
    const subscribers = new Set();
    let state = initialState;

    return {
        getState: () => state,
        dispatch: action =>
            pipe(
                reducer(state),
                newState => { state = newState; },
                () => subscribers.forEach(fn => fn())
            )(action),
        subscribe: fn => {
            subscribers.add(fn);
            return () => subscribers.delete(fn);
        }
    };
};
```

### Effect System
```javascript
// src/systems/effects/functions.js
const Effect = {
    of: value => ({ type: 'Effect', run: () => value }),
    map: fn => effect =>
        Effect.of(() => fn(effect.run())),
    chain: fn => effect =>
        Effect.of(() => fn(effect.run()).run()),
    run: effect => effect.run()
};
```

### Event System
```javascript
// src/systems/events/functions.js
const createEventBus = () => {
    const subscribers = new Map();
    
    return {
        emit: (event, data) =>
            Maybe.fromNullable(subscribers.get(event))
                .map(subs => subs.forEach(fn => fn(data))),
        on: (event, callback) => {
            const subs = subscribers.get(event) || new Set();
            subs.add(callback);
            subscribers.set(event, subs);
            return () => subs.delete(callback);
        }
    };
};
```

## Feature APIs

### Router
```javascript
// src/features/router/functions.js
const createRouter = (routes) => {
    const matchRoute = path =>
        pipe(
            Object.entries,
            find(([pattern]) => new RegExp(`^${pattern}$`).test(path)),
            Maybe.fromNullable,
            Maybe.map(([_, handler]) => handler)
        )(routes);

    return {
        navigate: path =>
            matchRoute(path)
                .map(Effect.of)
                .getOrElse(Effect.of(() => console.error('Route not found')))
    };
};
```

### Form Validation
```javascript
// src/features/validation/functions.js
const validate = schema => data =>
    pipe(
        Object.entries,
        map(([key, validator]) =>
            validator(data[key])
                .map(value => ({ [key]: value }))
                .mapError(error => ({ [key]: error }))
        ),
        results => Result.all(results)
    )(schema);
```

## Security Functions

### XSS Prevention
```javascript
// src/security/functions.js
const sanitize = input =>
    Either.fromNullable(input)
        .map(str => str.replace(/[<>]/g, ''))
        .getOrElse('');

const validateInput = predicate => input =>
    Either.fromNullable(input)
        .chain(value =>
            predicate(value)
                ? Either.Right(value)
                : Either.Left('Invalid input')
        );
```

## Utility Functions

### Array Operations
```javascript
// src/utils/array.js
const head = array =>
    Maybe.fromNullable(array[0]);

const tail = array =>
    array.length > 1 ? Maybe.Just(array.slice(1)) : Maybe.Nothing();

const find = predicate => array =>
    Maybe.fromNullable(array.find(predicate));
```

### Function Operations
```javascript
// src/utils/function.js
const memoize = fn => {
    const cache = new Map();
    return (...args) => {
        const key = JSON.stringify(args);
        return cache.has(key)
            ? cache.get(key)
            : pipe(
                fn,
                result => (cache.set(key, result), result)
              )(...args);
    };
};
```

## Version Information
- API Version: 1.0
- Last Updated: 2025-01-26
- Protocol Version: 1.0