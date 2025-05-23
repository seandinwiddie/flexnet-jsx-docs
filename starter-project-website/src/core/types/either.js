// Either type for error handling with enhanced safety
const Either = {
    Left: value => ({
        type: 'Left',
        value,
        map: fn => Either.Left(value),
        chain: fn => Either.Left(value),
        fold: (leftFn, rightFn) => {
            try {
                return leftFn(value);
            } catch (error) {
                return leftFn(error);
            }
        }
    }),
    Right: value => ({
        type: 'Right',
        value,
        map: fn => {
            try {
                return Either.Right(fn(value));
            } catch (error) {
                return Either.Left(error);
            }
        },
        chain: fn => {
            try {
                const result = fn(value);
                return result && (result.type === 'Left' || result.type === 'Right') ? result : Either.Right(result);
            } catch (error) {
                return Either.Left(error);
            }
        },
        fold: (leftFn, rightFn) => {
            try {
                return rightFn(value);
            } catch (error) {
                return leftFn(error);
            }
        }
    }),
    fromNullable: value => value != null ? Either.Right(value) : Either.Left('Value is null'),
    // Static helper methods with null safety
    map: fn => either => {
        if (!either || typeof either !== 'object' || !either.type) {
            return Either.Left(new Error('Invalid either object'));
        }
        return either.type === 'Right' ? Either.Right(fn(either.value)) : either;
    },
    chain: fn => either => {
        if (!either || typeof either !== 'object' || !either.type) {
            return Either.Left(new Error('Invalid either object'));
        }
        return either.type === 'Right' ? fn(either.value) : either;
    },
    fold: (leftFn, rightFn) => either => {
        if (!either || typeof either !== 'object' || !either.type) {
            return leftFn(new Error('Invalid either object'));
        }
        return either.type === 'Right' ? rightFn(either.value) : leftFn(either.value);
    }
};

export default Either; 