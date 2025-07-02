// === FlexNet Runtime Transform ===
// Pure functional data transformation utilities for FlexNet runtime

// Import all transform modules
import {
    transformElement,
    applyTransformation,
    transformProps,
    transformChildren,
    transformTree
} from './transform/coreTransforms.js';

import {
    addProp,
    removeProp,
    updateProp
} from './transform/propsTransforms.js';

import {
    addClass,
    removeClass,
    toggleClass
} from './transform/classTransforms.js';

import {
    addStyle,
    removeStyle
} from './transform/styleTransforms.js';

import {
    addDataAttribute,
    removeDataAttribute
} from './transform/dataTransforms.js';

import {
    addEventHandler,
    removeEventHandler
} from './transform/eventTransforms.js';

import {
    when,
    unless
} from './transform/conditionalTransforms.js';

import {
    filterChildren,
    mapChildren
} from './transform/childrenTransforms.js';

import { cloneElement } from './transform/elementCloning.js';

import { elementToString } from './transform/serialization.js';

import { validateElement } from './transform/validation.js';

import {
    composeTransforms,
    pipeTransforms
} from './transform/composition.js';

// Re-export all functions for backwards compatibility
export {
    // Core transformations
    transformElement,
    applyTransformation,
    transformProps,
    transformChildren,
    transformTree,
    
    // Props transformations
    addProp,
    removeProp,
    updateProp,
    
    // Class transformations
    addClass,
    removeClass,
    toggleClass,
    
    // Style transformations
    addStyle,
    removeStyle,
    
    // Data attribute transformations
    addDataAttribute,
    removeDataAttribute,
    
    // Event handler transformations
    addEventHandler,
    removeEventHandler,
    
    // Conditional transformations
    when,
    unless,
    
    // Children transformations
    filterChildren,
    mapChildren,
    
    // Element cloning
    cloneElement,
    
    // Serialization utilities
    elementToString,
    
    // Validation utilities
    validateElement,
    
    // Composition helpers
    composeTransforms,
    pipeTransforms
};
