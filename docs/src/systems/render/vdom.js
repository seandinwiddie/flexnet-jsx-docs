// === Virtual DOM Implementation ===
// Pure functional virtual DOM with immutable operations
// Now organized into individual function modules

import Maybe from '../../core/types/maybe.js';
import Either from '../../core/types/either.js';
import Result from '../../core/types/result.js';
import { compose, pipe, curry } from '../../core/functions/composition.js';
import { deepFreeze } from '../../utils/immutable.js';
import { escapeHTML } from '../../security/xss.js';

// ===========================================
// CORE VIRTUAL DOM IMPORTS
// ===========================================

// Virtual Node Types
export { VNodeType } from './vdom/types.js';

// Virtual Node Creation
export { createElement, createTextNode, createFragment } from './vdom/vnodeCreation.js';

// Component Handling
export { renderComponent } from './vdom/componentHandling.js';

// Virtual DOM Operations
export { diff, diffProps, diffChildren } from './vdom/diffing.js';

// DOM Patching
export { patch, applyPropPatches, applyChildPatches } from './vdom/patching.js';

// DOM Node Creation
export { createDOMNode } from './vdom/domCreation.js';

// Property Handling
export { setProp, removeProp } from './vdom/properties.js';

// Utility Functions
export { sanitizeProps, flattenChildren, createSetFromKeys } from './vdom/utilities.js';

// Main Render Function
export { render } from './vdom/render.js';

// ===========================================
// CONVENIENCE EXPORT OBJECT
// ===========================================

// Import for re-export in convenience object
import { VNodeType } from './vdom/types.js';
import { createElement, createTextNode, createFragment } from './vdom/vnodeCreation.js';
import { renderComponent } from './vdom/componentHandling.js';
import { diff, diffProps, diffChildren } from './vdom/diffing.js';
import { patch, applyPropPatches, applyChildPatches } from './vdom/patching.js';
import { createDOMNode } from './vdom/domCreation.js';
import { setProp, removeProp } from './vdom/properties.js';
import { sanitizeProps, flattenChildren, createSetFromKeys } from './vdom/utilities.js';
import { render } from './vdom/render.js';

export const VirtualDOM = Object.freeze({
    // Creation
    createElement,
    createTextNode,
    createFragment,
    
    // Component handling
    renderComponent,
    
    // Operations
    diff,
    patch,
    render,
    
    // DOM creation
    createDOMNode,
    
    // Types
    VNodeType
});

export default VirtualDOM;
