import { 
    executeEffect, 
    queryEffect,
    setAttributeEffect,
    logEffect,
    createAsyncEffect
} from '../../effects/functions.js';
import { createLogoConfig } from './componentConfigs.js';

// ===========================================
// LOGO SETUP
// ===========================================

// Pure logo setup using effects
export const setupLogoEffect = (basePath) =>
    createLogoConfig(basePath)
        .chain(config =>
            createAsyncEffect(async () => {
                await executeEffect(logEffect('Initializing logo', 'info'));
                
                const logoResult = await executeEffect(queryEffect(config.selector));
                
                if (logoResult.type === 'Just') {
                    await executeEffect(setAttributeEffect(logoResult.value, 'src', config.src));
                    await executeEffect(setAttributeEffect(logoResult.value, 'alt', config.alt));
                    return logoResult.value;
                } else {
                    await executeEffect(logEffect('Logo element not found', 'warn'));
                    return null;
                }
            })
        ); 