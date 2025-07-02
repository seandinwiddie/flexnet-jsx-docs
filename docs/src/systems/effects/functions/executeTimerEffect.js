import Either from '../../../core/types/either.js';

export const executeTimerEffect = (effect) => {
    const { operation, payload } = effect;

    switch (operation) {
        case 'setTimeout':
            const timeoutId = setTimeout(payload.callback, payload.delay);
            return Either.Right(timeoutId);

        case 'setInterval':
            const intervalId = setInterval(payload.callback, payload.interval);
            return Either.Right(intervalId);

        case 'clearTimeout':
            clearTimeout(payload.timeoutId);
            return Either.Right(payload.timeoutId);

        case 'clearInterval':
            clearInterval(payload.intervalId);
            return Either.Right(payload.intervalId);

        case 'delay':
            return new Promise(resolve => 
                setTimeout(() => resolve(Either.Right(payload.delay)), payload.delay)
            );

        default:
            return Either.Left(`Unknown timer operation: ${operation}`);
    }
}; 