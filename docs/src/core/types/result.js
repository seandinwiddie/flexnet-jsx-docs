// === Result Type Implementation ===
// Core functional type for handling operations that can fail

const Result = {
    Ok: value => ({ type: 'Ok', value }),
    Error: error => ({ type: 'Error', error }),
    fromTry: fn => {
        // Validate input
        if (typeof fn !== 'function') {
            return Result.Error('Input must be a function');
        }
        
        // Execute function safely
        try {
            const result = fn();
            return Result.Ok(result);
        } catch (e) {
            // Extract message without creating new Error objects
            const errorMessage = e && e.message ? e.message : String(e || 'Unknown error');
            return Result.Error(errorMessage);
        }
    },
    map: fn => result =>
        result.type === 'Ok' ? Result.Ok(fn(result.value)) : result,
    chain: fn => result =>
        result.type === 'Ok' ? fn(result.value) : result,
    mapLeft: fn => result =>
        result.type === 'Error' ? Result.Error(fn(result.error)) : result,
    fold: (errorFn, okFn) => result =>
        result.type === 'Ok' ? okFn(result.value) : errorFn(result.error),
    getOrElse: defaultValue => result =>
        result.type === 'Ok' ? result.value : defaultValue
};

export default Result;
