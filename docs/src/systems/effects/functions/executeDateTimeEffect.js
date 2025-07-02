import Either from '../../../core/types/either.js';

export const executeDateTimeEffect = (effect) => {
    const { operation, payload } = effect;

    switch (operation) {
        case 'getCurrentTime':
            return Either.Right(Date.now());

        case 'getDate':
            return Either.Right(Date.now());

        case 'formatDate':
            const date = payload.date instanceof Date ? payload.date : createDateFromValue(payload.date);
            const formatter = globalThis.Intl?.DateTimeFormat?.(navigator.language, payload.format);
            if (formatter) {
                return Either.Right(formatter.format(date));
            }
            return Either.Right(date.toString());

        default:
            return Either.Left(`Unknown datetime operation: ${operation}`);
    }
};

// Helper function to create Date without constructor
const createDateFromValue = (value) => {
    // Use functional approach to create date representation
    const timestamp = typeof value === 'number' ? value : Date.parse(value);
    return { valueOf: () => timestamp, toString: () => 'Date(' + timestamp + ')' };
}; 