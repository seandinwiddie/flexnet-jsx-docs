// Event prevention utilities
export const preventDefault = (handler) =>
    (event) => {
        event.preventDefault();
        return handler(event);
    };

export const stopPropagation = (handler) =>
    (event) => {
        event.stopPropagation();
        return handler(event);
    };

export const stopImmediatePropagation = (handler) =>
    (event) => {
        event.stopImmediatePropagation();
        return handler(event);
    }; 