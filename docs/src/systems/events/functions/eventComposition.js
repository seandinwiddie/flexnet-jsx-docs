// Event composition utilities
export const composeEventHandlers = (...handlers) =>
    (event) => {
        const results = [];
        
        for (const handler of handlers) {
            if (typeof handler === 'function') {
                try {
                    const result = handler(event);
                    results.push({ success: true, result });
                } catch (error) {
                    results.push({ success: false, error });
                }
            }
        }
        
        return results;
    };

export const pipeEventHandlers = (...handlers) =>
    (event) => {
        let currentEvent = event;
        const results = [];
        
        for (const handler of handlers) {
            if (typeof handler === 'function') {
                try {
                    const result = handler(currentEvent);
                    results.push({ success: true, result });
                    
                    // If handler returns an event-like object, use it for next handler
                    if (result && typeof result === 'object' && result.type) {
                        currentEvent = result;
                    }
                } catch (error) {
                    results.push({ success: false, error });
                    break; // Stop pipe on error
                }
            }
        }
        
        return results;
    }; 