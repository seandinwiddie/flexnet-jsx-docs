import Either from '../../core/types/either.js';
import Result from '../../core/types/result.js';
import { jsx } from '../../core/runtime/jsx.js';

// Error logging with sensitive data redaction
const errorLogger = {
    sensitiveKeys: ['password', 'token', 'secret', 'key', 'auth'],

    sanitizeError: error => {
        if (!error || typeof error !== 'object') {
            return error;
        }

        const sanitized = { ...error };
        errorLogger.sensitiveKeys.forEach(key => {
            if (key in sanitized) {
                sanitized[key] = '[REDACTED]';
            }
        });
        return sanitized;
    },

    logError: error => {
        const sanitizedError = errorLogger.sanitizeError(error);
        console.error('Secure Error:', sanitizedError);
        return sanitizedError;
    }
};

// Error boundary factory function
const createErrorBoundary = (fallbackComponent) => {
    let hasError = false;
    let error = null;

    const ErrorBoundary = ({ children }) => {
        // Handle errors that occur during rendering
        const safeRender = () => {
            return Result.fromTry(() => {
                if (hasError) {
                    return fallbackComponent 
                        ? fallbackComponent(error) 
                        : jsx('div', { 
                            style: 'color: red; padding: 10px; border: 1px solid red; margin: 10px;' 
                          }, 'Something went wrong');
                }
                return children;
            });
        };

        const renderResult = safeRender();
        
        if (renderResult.type === 'Error') {
            hasError = true;
            error = renderResult.error;
            errorLogger.logError(renderResult.error);
            
            return fallbackComponent 
                ? fallbackComponent(renderResult.error)
                : jsx('div', { 
                    style: 'color: red; padding: 10px; border: 1px solid red; margin: 10px;' 
                  }, 'Rendering Error');
        }

        return renderResult.value;
    };

    // Reset error boundary
    ErrorBoundary.reset = () => {
        hasError = false;
        error = null;
    };

    return ErrorBoundary;
};

// Global error handler setup
const setupGlobalErrorHandler = () => {
    const handleError = event => {
        event.preventDefault();
        errorLogger.logError(event.error);
    };

    const handleUnhandledRejection = event => {
        event.preventDefault();
        errorLogger.logError(event.reason);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Return cleanup function
    return () => {
        window.removeEventListener('error', handleError);
        window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
};

export {
    createErrorBoundary,
    errorLogger,
    setupGlobalErrorHandler
}; 