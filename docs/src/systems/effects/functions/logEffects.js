// === Log Effects ===
// Pure functional logging using Effect type

import { Effect } from './effect.js';

export const log = (message, level = 'info') =>
    Effect.of(() => {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
        
        switch (level) {
            case 'error':
                console.error(logMessage);
                break;
            case 'warn':
                console.warn(logMessage);
                break;
            case 'debug':
                console.debug(logMessage);
                break;
            default:
                console.log(logMessage);
        }
        
        return logMessage;
    });

export const logError = (error) =>
    log(`Error: ${error.message || error}`, 'error'); 