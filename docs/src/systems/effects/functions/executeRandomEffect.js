import Either from '../../../core/types/either.js';

export const executeRandomEffect = (effect) => {
    const { operation, payload } = effect;

    switch (operation) {
        case 'number':
            const randomFloat = Math.random() * (payload.max - payload.min) + payload.min;
            return Either.Right(randomFloat);

        case 'integer':
            const randomInt = Math.floor(Math.random() * (payload.max - payload.min + 1)) + payload.min;
            return Either.Right(randomInt);

        case 'uuid':
            // Functional UUID generation without constructors
            const hex = '0123456789abcdef';
            const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
                const r = Math.random() * 16 | 0;
                const v = c === 'x' ? r : (r & 0x3 | 0x8);
                return hex[v];
            });
            return Either.Right(uuid);

        default:
            return Either.Left(`Unknown random operation: ${operation}`);
    }
}; 