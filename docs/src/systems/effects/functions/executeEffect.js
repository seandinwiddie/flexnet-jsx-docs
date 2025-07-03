import { Effect } from './effect.js';
import Either from '../../../core/types/either.js';
import Result from '../../../core/types/result.js';

// === Effect Executor ===
// Pure functional effect execution following FlexNet documentation standards

/**
 * Pure functional effect executor that maintains type safety
 * Returns Either<Error, Success> instead of throwing or using Promise.reject
 * @param {Effect} effect - The effect to execute
 * @returns {Either} Either containing the result or error
 */
export const executeEffect = (effect) => {
    // Validate that input is a proper Effect
    const validateEffect = (eff) =>
        Effect.isEffect(eff)
            ? Either.Right(eff)
            : Either.Left(`Invalid effect: expected Effect type, got ${typeof eff}`);
    
    // Execute validated effect safely
    const runValidatedEffect = (validEffect) => {
        try {
            return validEffect.run();
        } catch (error) {
            const errorMessage = error && error.message ? error.message : String(error || 'Effect execution failed');
            return Either.Left(errorMessage);
        }
    };
    
    // Compose the execution pipeline
    return Either.chain(runValidatedEffect)(validateEffect(effect));
};

/**
 * Execute multiple effects in sequence, stopping on first error
 * @param {...Effect} effects - Effects to execute in sequence
 * @returns {Either} Either containing array of results or first error
 */
export const chainEffects = (...effects) => {
    const executeSequentially = (remainingEffects, accumulator = []) => {
        if (remainingEffects.length === 0) {
            return Either.Right(accumulator);
        }
        
        const [first, ...rest] = remainingEffects;
        const result = executeEffect(first);
        
        return Either.fold(
            error => Either.Left(error),
            value => executeSequentially(rest, [...accumulator, value])
        )(result);
    };
    
    return executeSequentially(effects);
};

/**
 * Execute multiple effects in parallel, collecting all results
 * @param {...Effect} effects - Effects to execute in parallel
 * @returns {Either} Either containing array of results or array of errors
 */
export const parallelEffects = (...effects) => {
    const results = effects.map(executeEffect);
    const errors = results.filter(result => result.type === 'Left');
    const successes = results.filter(result => result.type === 'Right');
    
    return errors.length > 0
        ? Either.Left(errors.map(err => err.value))
        : Either.Right(successes.map(success => success.value));
};

/**
 * Execute an effect and provide a default value if it fails
 * @param {*} defaultValue - Default value to return on error
 * @param {Effect} effect - Effect to execute
 * @returns {Either} Either containing result or default value (always Right)
 */
export const executeEffectWithDefault = (defaultValue) => (effect) => 
    Either.fold(
        () => Either.Right(defaultValue),
        value => Either.Right(value)
    )(executeEffect(effect));

/**
 * Execute an effect and transform errors
 * @param {Function} errorTransform - Function to transform error messages
 * @param {Effect} effect - Effect to execute
 * @returns {Either} Either with transformed error or original success
 */
export const executeEffectMapError = (errorTransform) => (effect) =>
    Either.mapLeft(errorTransform)(executeEffect(effect));

/**
 * Create a safe effect executor that never throws
 * @param {Effect} effect - Effect to execute safely
 * @returns {Result} Result containing success or error
 */
export const safeExecuteEffect = (effect) =>
    Result.fromTry(() => {
        const result = executeEffect(effect);
        return Either.fold(
            error => { throw new Error(error); },
            value => value
        )(result);
    }); 