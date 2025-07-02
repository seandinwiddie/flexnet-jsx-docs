import Either from '../../../core/types/either.js';

export const executeAsyncEffect = async (effect) => {
    const { operation, payload } = effect;

    switch (operation) {
        case 'execute':
            try {
                const result = await payload.asyncFunction();
                return Either.Right(result);
            } catch (error) {
                return Either.Left(error.message || 'Async operation failed');
            }

        default:
            return Either.Left(`Unknown async operation: ${operation}`);
    }
}; 