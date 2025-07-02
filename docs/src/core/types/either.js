// === Either Type Implementation ===
// Core functional type for handling success/failure cases

const Either = {
    Left: value => ({ type: 'Left', value }),
    Right: value => ({ type: 'Right', value }),
    fromNullable: value => value != null ? Either.Right(value) : Either.Left('Value is null'),
    map: fn => either =>
        either.type === 'Right' ? Either.Right(fn(either.value)) : either,
    chain: fn => either =>
        either.type === 'Right' ? fn(either.value) : either,
    fold: (leftFn, rightFn) => either =>
        either.type === 'Right' ? rightFn(either.value) : leftFn(either.value),
    mapLeft: fn => either =>
        either.type === 'Left' ? Either.Left(fn(either.value)) : either,
    getOrElse: defaultValue => either =>
        either.type === 'Right' ? either.value : defaultValue
};

export default Either;
