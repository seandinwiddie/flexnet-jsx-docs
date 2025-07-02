import { 
    executeEffect, 
    queryEffect,
    addClassEffect,
    removeClassEffect,
    addEventListenerEffect,
    logEffect,
    createAsyncEffect
} from '../../effects/functions.js';
import { createSidebarConfig } from './componentConfigs.js';

// ===========================================
// MOBILE SIDEBAR SETUP
// ===========================================

// Pure mobile sidebar setup using effects
export const setupMobileSidebarEffect = () =>
    createAsyncEffect(async () => {
        await executeEffect(logEffect('Initializing mobile sidebar', 'info'));
        
        const config = createSidebarConfig();
        
        const closeSidebar = async () => {
            const sidebarResult = await executeEffect(queryEffect(config.sidebarSelector));
            const overlayResult = await executeEffect(queryEffect(config.overlaySelector));
            
            if (sidebarResult.type === 'Just') {
                await executeEffect(addClassEffect(sidebarResult.value, '-translate-x-full'));
            }
            if (overlayResult.type === 'Just') {
                await executeEffect(addClassEffect(overlayResult.value, config.hiddenClass));
            }
        };
        
        const openSidebar = async () => {
            const sidebarResult = await executeEffect(queryEffect(config.sidebarSelector));
            const overlayResult = await executeEffect(queryEffect(config.overlaySelector));
            
            if (sidebarResult.type === 'Just') {
                await executeEffect(removeClassEffect(sidebarResult.value, '-translate-x-full'));
            }
            if (overlayResult.type === 'Just') {
                await executeEffect(removeClassEffect(overlayResult.value, config.hiddenClass));
            }
        };
        
        // Setup event listeners
        const toggleResult = await executeEffect(queryEffect(config.toggleSelector));
        const overlayResult = await executeEffect(queryEffect(config.overlaySelector));
        
        if (toggleResult.type === 'Just') {
            await executeEffect(addEventListenerEffect(toggleResult.value, 'click', openSidebar));
        }
        
        if (overlayResult.type === 'Just') {
            await executeEffect(addEventListenerEffect(overlayResult.value, 'click', closeSidebar));
        }
        
        return { closeSidebar, openSidebar };
    }); 