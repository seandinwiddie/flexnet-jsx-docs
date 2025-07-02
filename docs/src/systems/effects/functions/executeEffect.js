import Either from '../../../core/types/either.js';
import { EffectType } from './EffectType.js';
import { executeDOMEffect } from './executeDOMEffect.js';
import { executeHTTPEffect } from './executeHTTPEffect.js';
import { executeStorageEffect } from './executeStorageEffect.js';
import { executeTimerEffect } from './executeTimerEffect.js';
import { executeRandomEffect } from './executeRandomEffect.js';
import { executeDateTimeEffect } from './executeDateTimeEffect.js';
import { executeLogEffect } from './executeLogEffect.js';
import { executeBrowserAPIEffect } from './executeBrowserAPIEffect.js';
import { executeAnimationEffect } from './executeAnimationEffect.js';
import { executeAsyncEffect } from './executeAsyncEffect.js';

// Effect execution engine - Promise-compatible for async composition
export const executeEffect = async (effect) => {
    try {
        if (!effect || !effect._isEffect) {
            return Either.Left('Invalid effect object');
        }

        let result;
        switch (effect.type) {
            case EffectType.DOM:
                result = executeDOMEffect(effect);
                break;
            case EffectType.HTTP:
                result = await executeHTTPEffect(effect);
                break;
            case EffectType.STORAGE:
                result = executeStorageEffect(effect);
                break;
            case EffectType.TIMER:
                result = await executeTimerEffect(effect);
                break;
            case EffectType.RANDOM:
                result = executeRandomEffect(effect);
                break;
            case EffectType.DATETIME:
                result = executeDateTimeEffect(effect);
                break;
            case EffectType.LOG:
                result = executeLogEffect(effect);
                break;
            case EffectType.BROWSER_API:
                result = await executeBrowserAPIEffect(effect);
                break;
            case EffectType.ANIMATION:
                result = executeAnimationEffect(effect);
                break;
            case EffectType.ASYNC:
                result = await executeAsyncEffect(effect);
                break;
            default:
                result = Either.Left(`Unknown effect type: ${effect.type}`);
        }
        
        return result;
    } catch (error) {
        return Either.Left(`Effect execution failed: ${error.message || error}`);
    }
}; 