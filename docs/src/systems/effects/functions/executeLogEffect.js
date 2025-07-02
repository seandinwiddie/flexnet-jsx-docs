import Either from '../../../core/types/either.js';

export const executeLogEffect = (effect) => {
    const { operation, payload } = effect;

    const timestamp = Date.now();
    const logEntry = {
        timestamp,
        level: payload.level || 'info',
        message: payload.message,
        context: payload.context || {}
    };

    switch (operation) {
        case 'log':
            switch (payload.level) {
                case 'error':
                    console.error(`[${timestamp}] ERROR:`, payload.message);
                    break;
                case 'warn':
                    console.warn(`[${timestamp}] WARN:`, payload.message);
                    break;
                case 'debug':
                    console.debug(`[${timestamp}] DEBUG:`, payload.message);
                    break;
                case 'info':
                default:
                    console.info(`[${timestamp}] INFO:`, payload.message);
                    break;
            }
            return Either.Right(logEntry);

        case 'error':
            console.error(`[${timestamp}] ERROR:`, payload.error, payload.context);
            return Either.Right({
                ...logEntry,
                level: 'error',
                error: payload.error
            });

        default:
            return Either.Left(`Unknown log operation: ${operation}`);
    }
}; 