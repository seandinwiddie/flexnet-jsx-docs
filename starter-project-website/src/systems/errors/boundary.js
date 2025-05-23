import Either from '../../core/types/either.js';
import Result from '../../core/types/result.js';
import { jsx } from '../../core/runtime/jsx.js';

// Error logging with sensitive data redaction
const errorLogger = {
    sensitiveKeys: ['password', 'token', 'secret', 'key', 'auth'],

    sanitizeError: error => {
        if (!error) {
            return { message: 'Undefined error object' };
        }
        if (typeof error !== 'object') {
            return { message: String(error) }; // Convert non-objects to string
        }

        const sanitized = { ...error }; // Spread even if it's an error instance
        // Ensure 'message' property exists, even if empty
        if (!sanitized.hasOwnProperty('message') && error.message) {
            sanitized.message = error.message;
        }

        errorLogger.sensitiveKeys.forEach(key => {
            if (key in sanitized) {
                sanitized[key] = '[REDACTED]';
            }
        });
        return sanitized;
    },

    logError: error => {
        const timestamp = new Date().toISOString();
        const sanitizedError = errorLogger.sanitizeError(error);
        
        // Add more context if the error is still minimal
        if (Object.keys(sanitizedError).length === 0 && error) {
            console.error(`[${timestamp}] FlexNet Secure Error (minimal object):`, error);
        } else {
            console.error(`[${timestamp}] FlexNet Secure Error:`, sanitizedError);
        }
        
        // Log stack trace if available
        if (error && error.stack) {
            console.error(`[${timestamp}] Error Stack Trace:`, error.stack);
        }
        
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
                          }, `Something went wrong: ${error && error.message ? error.message : 'Unknown error'}`);
                }
                return children;
            });
        };

        const renderResult = safeRender();
        
        if (renderResult && renderResult.type === 'Error') {
            hasError = true;
            error = renderResult.error;
            errorLogger.logError(renderResult.error);
            
            return fallbackComponent 
                ? fallbackComponent(renderResult.error)
                : jsx('div', { 
                    style: 'color: red; padding: 10px; border: 1px solid red; margin: 10px;'
                  }, `Rendering Error: ${renderResult.error && renderResult.error.message ? renderResult.error.message : 'Details unavailable'}`);
        }

        return renderResult ? renderResult.value : children;
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