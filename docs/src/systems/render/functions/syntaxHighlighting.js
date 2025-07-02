import { 
    executeEffect, 
    logEffect,
    createAsyncEffect
} from '../../effects/functions.js';

// ===========================================
// SYNTAX HIGHLIGHTING SETUP
// ===========================================

// Pure syntax highlighting setup using effects
export const setupSyntaxHighlightingEffect = () =>
    createAsyncEffect(async () => {
        await executeEffect(logEffect('Initializing syntax highlighting', 'info'));
        
        if (window.hljs) {
            window.hljs.highlightAll();
            return 'Syntax highlighting initialized';
        } else {
            await executeEffect(logEffect('hljs not available', 'warn'));
            return null;
        }
    }); 