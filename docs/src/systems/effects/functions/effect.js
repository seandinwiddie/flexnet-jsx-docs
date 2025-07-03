// === Core Effect Type ===
// Truly functional Effect type following FlexNet documentation standards

import Either from '../../../core/types/either.js';
import Result from '../../../core/types/result.js';

/**
 * Pure functional Effect type that wraps side effects
 * All effects return Either types for proper error handling
 * @param {Function} computation - The effectful computation to wrap
 * @returns {Object} Effect object with functional methods
 */
const Effect = (computation) => ({
    type: 'Effect',
    _computation: computation,
    
    // Execute the effect and return Either<Error, Success>
    run: () => {
        try {
            const result = computation();
            // Ensure result is wrapped in Either
            return result && result.type && (result.type === 'Left' || result.type === 'Right')
                ? result
                : Either.Right(result);
        } catch (error) {
            const errorMessage = error && error.message ? error.message : String(error || 'Unknown error');
            return Either.Left(errorMessage);
        }
    },
    
    // Functor: map over the successful value
    map: (fn) => Effect(() => {
        const result = computation();
        return result && result.type === 'Right'
            ? Either.Right(fn(result.value))
            : result && result.type === 'Left'
                ? result
                : Either.Right(fn(result));
    }),
    
    // Monad: chain effects together
    chain: (fn) => Effect(() => {
        const result = computation();
        if (result && result.type === 'Right') {
            const nextEffect = fn(result.value);
            return nextEffect && typeof nextEffect.run === 'function'
                ? nextEffect.run()
                : Either.Left('Chain function must return an Effect');
        }
        return result && result.type === 'Left'
            ? result
            : Either.Left('Invalid computation result');
    }),
    
    // Handle both success and error cases
    fold: (leftFn, rightFn) => Effect(() => {
        const result = computation();
        return result && result.type === 'Right'
            ? rightFn(result.value)
            : result && result.type === 'Left'
                ? leftFn(result.value)
                : leftFn('Invalid computation result');
    }),
    
    // Applicative: apply a function effect to a value effect
    ap: (effectFn) => Effect(() => {
        const fnResult = effectFn.run();
        const valueResult = computation();
        
        if (fnResult.type === 'Right' && valueResult.type === 'Right') {
            return Either.Right(fnResult.value(valueResult.value));
        }
        
        return fnResult.type === 'Left' ? fnResult : valueResult;
    })
});

// Pure constructor functions
Effect.of = (value) => Effect(() => Either.Right(value));

Effect.fromEither = (either) => Effect(() => either);

Effect.fromResult = (result) => Effect(() => 
    result.type === 'Ok' 
        ? Either.Right(result.value)
        : Either.Left(result.error)
);

Effect.fromTry = (computation) => Effect(() => {
    try {
        const result = computation();
        return Either.Right(result);
    } catch (error) {
        const errorMessage = error && error.message ? error.message : String(error || 'Unknown error');
        return Either.Left(errorMessage);
    }
});

// Utility to check if something is an Effect
Effect.isEffect = (obj) => obj && obj.type === 'Effect' && typeof obj.run === 'function';

export { Effect }; 