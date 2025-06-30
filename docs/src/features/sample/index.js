// === Sample Feature Module ===
// Template for creating feature modules in FlexNet

import { setupSampleFeature } from './functions.js';

// Feature initialization
export const initSampleFeature = () => {
    console.log('[Sample Feature] Initializing sample feature');
    return setupSampleFeature();
};

// Export feature functions
export * from './functions.js';
