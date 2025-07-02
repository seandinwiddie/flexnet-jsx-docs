import Maybe from '../../../core/types/maybe.js';
import Either from '../../../core/types/either.js';

export const executeStorageEffect = (effect) => {
    const { operation, payload } = effect;

    try {
        switch (operation) {
            case 'setLocalStorage':
                localStorage.setItem(payload.key, payload.value);
                return Either.Right(payload.value);

            case 'getLocalStorage':
                const value = localStorage.getItem(payload.key);
                return Maybe.fromNullable(value);

            case 'removeLocalStorage':
                localStorage.removeItem(payload.key);
                return Either.Right(payload.key);

            case 'clearLocalStorage':
                localStorage.clear();
                return Either.Right(true);

            case 'setSessionStorage':
                sessionStorage.setItem(payload.key, payload.value);
                return Either.Right(payload.value);

            case 'getSessionStorage':
                const sessionValue = sessionStorage.getItem(payload.key);
                return Maybe.fromNullable(sessionValue);

            default:
                return Either.Left(`Unknown storage operation: ${operation}`);
        }
    } catch (error) {
        return Either.Left(error.message || 'Storage operation failed');
    }
}; 