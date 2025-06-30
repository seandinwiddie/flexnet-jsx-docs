// === Result Type Implementation ===
// Core functional type for handling operations that can fail

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
        result.type === 'Ok' ? fn(result.value) : result,
};

export default Result;
