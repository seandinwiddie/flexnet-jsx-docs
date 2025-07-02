// === FlexNet Render System ===
// Pure functional DOM rendering matching documented API
// Individual functions in separate files, this is just the root import/export

// Core Rendering Functions
export { createElement } from './functions/createElement.js';
export { render } from './functions/render.js';
export { createVirtualDOM } from './functions/createVirtualDOM.js';
export { reconcile } from './functions/reconcile.js';
export { patch } from './functions/patch.js';

// Utility Functions  
export { initializeUI } from './functions/initializeUI.js';

// Legacy compatibility for existing code
import { pipe } from '../../core/functions/composition.js';
