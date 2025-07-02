import { 
    executeEffect, 
    queryAllEffect,
    addClassEffect,
    removeClassEffect,
    logEffect,
    createAsyncEffect
} from '../../effects/functions.js';
import { createSidebarConfig } from './componentConfigs.js';

// ===========================================
// SIDEBAR ACTIVE LINK SETUP
// ===========================================

// Pure sidebar active link setup using effects
export const setupSidebarActiveLinkEffect = () =>
    createAsyncEffect(async () => {
        await executeEffect(logEffect('Initializing sidebar active link', 'info'));
        
        const currentPath = window.location.pathname;
        const linksResult = await executeEffect(queryAllEffect('#sidebar-placeholder a'));
        const config = createSidebarConfig();
        
        for (const link of linksResult) {
            const href = link.getAttribute('href');
            
            if (href && currentPath.endsWith(href)) {
                // Add active classes
                for (const className of config.activeClasses) {
                    await executeEffect(addClassEffect(link, className));
                }
                
                // Remove inactive classes
                for (const className of config.inactiveClasses) {
                    await executeEffect(removeClassEffect(link, className));
                }
            }
        }
        
        return linksResult;
    }); 