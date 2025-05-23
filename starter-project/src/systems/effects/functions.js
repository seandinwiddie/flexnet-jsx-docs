// Effect system implementation
import Result from '../../core/types/result.js';

const Effect = {
    of: value => ({ type: 'Effect', run: () => value }),
    map: fn => effect =>
        Effect.of(() => fn(effect.run())),
    chain: fn => effect =>
        Effect.of(() => fn(effect.run()).run()),
    run: effect => effect.run()
};

// Create effect with cleanup
const createEffect = effect => {
    let cleanup = null;
    
    const run = () => {
        if (cleanup) cleanup();
        cleanup = effect();
        return cleanup;
    };
    
    const dispose = () => {
        if (cleanup) cleanup();
        cleanup = null;
    };
    
    return {
        run,
        dispose
    };
};

export { Effect, createEffect }; 