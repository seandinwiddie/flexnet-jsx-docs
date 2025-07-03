// === Log Effects ===
// Pure functional logging using Effect type
// All effects return Either<Error, Success> for proper error handling

import { Effect } from './effect.js';
import Either from '../../../core/types/either.js';

/**
 * Pure effect to log a message with specified level
 * @param {string} message - Message to log
 * @param {string} level - Log level (info, warn, error, debug)
 * @returns {Effect} Effect that returns Either<Error, LogEntry>
 */
export const log = (message, level = 'info') =>
    Effect(() => {
        const validateLevel = (lvl) => {
            const validLevels = ['info', 'warn', 'error', 'debug'];
            return validLevels.includes(lvl)
                ? Either.Right(lvl)
                : Either.Left(`Invalid log level: ${lvl}. Must be one of: ${validLevels.join(', ')}`);
        };

        const validateMessage = (msg) =>
            msg !== null && msg !== undefined
                ? Either.Right(String(msg))
                : Either.Left('Message cannot be null or undefined');

        return Either.chain(validLevel =>
            Either.map(validMessage => {
                const timestamp = new Date().toISOString();
                const logEntry = {
                    timestamp,
                    level: validLevel,
                    message: validMessage,
                    formatted: `[${timestamp}] [${validLevel.toUpperCase()}] ${validMessage}`
                };

                // Side effect: actual logging (isolated within Effect)
                try {
                    switch (validLevel) {
                        case 'error':
                            console.error(logEntry.formatted);
                            break;
                        case 'warn':
                            console.warn(logEntry.formatted);
                            break;
                        case 'debug':
                            console.debug(logEntry.formatted);
                            break;
                        default:
                            console.log(logEntry.formatted);
                    }
                    
                    return Either.Right(Object.freeze(logEntry));
                } catch (error) {
                    return Either.Left(`Logging failed: ${error.message}`);
                }
            })(validateMessage(message))
        )(validateLevel(level));
    });

/**
 * Pure effect specifically for error logging
 * @param {string|Error} error - Error to log
 * @returns {Effect} Effect that returns Either<Error, LogEntry>
 */
export const logError = (error) => {
    const errorMessage = error instanceof Error
        ? error.message
        : String(error || 'Unknown error');
    
    return log(errorMessage, 'error');
};

/**
 * Pure effect specifically for warning logging
 * @param {string} message - Warning message to log
 * @returns {Effect} Effect that returns Either<Error, LogEntry>
 */
export const logWarn = (message) => log(message, 'warn');

/**
 * Pure effect specifically for debug logging
 * @param {string} message - Debug message to log
 * @returns {Effect} Effect that returns Either<Error, LogEntry>
 */
export const logDebug = (message) => log(message, 'debug');

/**
 * Pure effect specifically for info logging
 * @param {string} message - Info message to log
 * @returns {Effect} Effect that returns Either<Error, LogEntry>
 */
export const logInfo = (message) => log(message, 'info');

/**
 * Pure effect to log multiple messages as a group
 * @param {Array} messages - Array of message objects {message, level}
 * @returns {Effect} Effect that returns Either<Error, Array<LogEntry>>
 */
export const logGroup = (messages) =>
    Effect(() => {
        const validateMessages = (msgs) =>
            Array.isArray(msgs)
                ? Either.Right(msgs)
                : Either.Left('Messages must be an array');

        return Either.chain(validMessages => {
            try {
                const logEntries = validMessages.map(({ message, level = 'info' }) => {
                    const logEffect = log(message, level);
                    const result = logEffect.run();
                    return Either.fold(
                        error => ({ error }),
                        entry => entry
                    )(result);
                });

                const errors = logEntries.filter(entry => entry.error);
                if (errors.length > 0) {
                    return Either.Left(`Group logging failed: ${errors.map(e => e.error).join(', ')}`);
                }

                return Either.Right(Object.freeze(logEntries));
            } catch (error) {
                return Either.Left(`Group logging error: ${error.message}`);
            }
        })(validateMessages(messages));
    });

/**
 * Pure effect to create a performance log entry
 * @param {string} operation - Operation name
 * @param {number} startTime - Start timestamp
 * @param {number} endTime - End timestamp
 * @returns {Effect} Effect that returns Either<Error, LogEntry>
 */
export const logPerformance = (operation, startTime, endTime) =>
    Effect(() => {
        const validateOperation = (op) =>
            typeof op === 'string' && op.trim()
                ? Either.Right(op.trim())
                : Either.Left('Operation name must be a non-empty string');

        const validateTimes = (start, end) =>
            typeof start === 'number' && typeof end === 'number' && end >= start
                ? Either.Right({ start, end, duration: end - start })
                : Either.Left('Invalid timestamps: must be numbers with end >= start');

        return Either.chain(validOperation =>
            Either.chain(times => {
                const performanceMessage = `${validOperation} completed in ${times.duration}ms`;
                const logEffect = log(performanceMessage, 'debug');
                return logEffect.run();
            })(validateTimes(startTime, endTime))
        )(validateOperation(operation));
    }); 