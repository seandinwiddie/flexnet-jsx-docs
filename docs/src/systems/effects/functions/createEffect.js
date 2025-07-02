// Core Effect structure
export const createEffect = (type, operation, payload = {}) =>
    Object.freeze({
        type,
        operation,
        payload: Object.freeze(payload),
        timestamp: Date.now(),
        _isEffect: true
    }); 