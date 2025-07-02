import Either from '../../../core/types/either.js';

export const executeAnimationEffect = (effect) => {
    const { operation, payload } = effect;

    switch (operation) {
        case 'requestAnimationFrame':
            const id = requestAnimationFrame(payload.callback);
            return Either.Right(id);

        case 'cancelAnimationFrame':
            cancelAnimationFrame(payload.id);
            return Either.Right(payload.id);

        default:
            return Either.Left(`Unknown animation operation: ${operation}`);
    }
}; 