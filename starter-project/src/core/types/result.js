// Result type for operation outcomes
const Result = {
    Ok: value => ({
        type: 'Ok',
        value,
        map: fn => Result.Ok(fn(value)),
        chain: fn => fn(value),
        fold: (errorFn, successFn) => successFn(value)
    }),
    Error: error => ({
        type: 'Error',
        error,
        map: fn => Result.Error(error),
        chain: fn => Result.Error(error),
        fold: (errorFn, successFn) => errorFn(error)
    }),
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
        result.type === 'Ok' ? fn(result.value) : result,
    fold: (errorFn, successFn) => result =>
        result.type === 'Error' ? errorFn(result.error) : successFn(result.value)
};

export default Result; 