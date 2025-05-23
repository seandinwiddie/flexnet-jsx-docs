// Either type for error handling
const Either = {
    Left: value => ({
        type: 'Left',
        value,
        map: fn => Either.Left(value),
        chain: fn => Either.Left(value),
        fold: (leftFn, rightFn) => leftFn(value)
    }),
    Right: value => ({
        type: 'Right',
        value,
        map: fn => Either.Right(fn(value)),
        chain: fn => fn(value),
        fold: (leftFn, rightFn) => rightFn(value)
    }),
    fromNullable: value => value != null ? Either.Right(value) : Either.Left('Value is null'),
    map: fn => either =>
        either.type === 'Right' ? Either.Right(fn(either.value)) : either,
    chain: fn => either =>
        either.type === 'Right' ? fn(either.value) : either,
    fold: (leftFn, rightFn) => either =>
        either.type === 'Right' ? rightFn(either.value) : leftFn(either.value)
};

export default Either; 