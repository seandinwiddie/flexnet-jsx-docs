// Result type for operation outcomes with enhanced error handling
const Result = {
    Ok: value => ({
        type: 'Ok',
        value,
        map: fn => {
            try {
                return Result.Ok(fn(value));
            } catch (error) {
                return Result.Error(error);
            }
        },
        chain: fn => {
            try {
                const result = fn(value);
                return result && (result.type === 'Ok' || result.type === 'Error') ? result : Result.Ok(result);
            } catch (error) {
                return Result.Error(error);
            }
        },
        fold: (errorFn, successFn) => {
            try {
                return successFn(value);
            } catch (error) {
                return errorFn(error);
            }
        }
    }),
    Error: error => ({
        type: 'Error',
        error,
        map: fn => Result.Error(error),
        chain: fn => Result.Error(error),
        fold: (errorFn, successFn) => {
            try {
                return errorFn(error);
            } catch (e) {
                return errorFn(e);
            }
        }
    }),
    fromTry: fn => {
        try {
            const result = fn();
            return Result.Ok(result);
        } catch (e) {
            return Result.Error(e);
        }
    },
    // Static helper methods with null safety
    map: fn => result => {
        if (!result || typeof result !== 'object' || !result.type) {
            return Result.Error(new Error('Invalid result object'));
        }
        return result.type === 'Ok' ? Result.Ok(fn(result.value)) : result;
    },
    chain: fn => result => {
        if (!result || typeof result !== 'object' || !result.type) {
            return Result.Error(new Error('Invalid result object'));
        }
        return result.type === 'Ok' ? fn(result.value) : result;
    },
    fold: (errorFn, successFn) => result => {
        if (!result || typeof result !== 'object' || !result.type) {
            return errorFn(new Error('Invalid result object'));
        }
        return result.type === 'Error' ? errorFn(result.error) : successFn(result.value);
    }
};

export default Result; 