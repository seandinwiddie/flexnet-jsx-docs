// === FlexNet State System ===
// Pure functional state management with immutable transitions
// Now organized into individual function modules

import Maybe from '../../core/types/maybe.js';
import Either from '../../core/types/either.js';
import Result from '../../core/types/result.js';
import { compose, pipe, curry } from '../../core/functions/composition.js';
import { ImmutableSet, deepFreeze } from '../../utils/immutable.js';

// ===========================================
// CORE STATE SYSTEM IMPORTS
// ===========================================

// Core State Management
export { createState, createReducer } from './functions/coreState.js';

// Property Operations
export { updateProperty, setProperty, deleteProperty } from './functions/propertyOperations.js';

// Array Operations
export { 
    appendToArray, 
    prependToArray, 
    removeFromArray, 
    updateArrayItem 
} from './functions/arrayOperations.js';

// Object Operations
export { mergeObject } from './functions/objectOperations.js';

// Conditional Operations
export { updateWhen, updateUnless } from './functions/conditionalOperations.js';

// State Validation
export { validateState } from './functions/validation.js';

// Lens Operations
export { createLens, propertyLens, pathLens } from './functions/lenses.js';

// State Composition
export { combineStates } from './functions/composition.js';

// State Persistence
export { persistState, loadPersistedState } from './functions/persistence.js';

// State Debugging
export { logStateChanges, createStateLogger } from './functions/debugging.js';

// ===========================================
// CONVENIENCE EXPORT OBJECT
// ===========================================

// Import for re-export in convenience object
import { createState, createReducer } from './functions/coreState.js';
import { updateProperty, setProperty, deleteProperty } from './functions/propertyOperations.js';
import { appendToArray, prependToArray, removeFromArray, updateArrayItem } from './functions/arrayOperations.js';
import { mergeObject } from './functions/objectOperations.js';
import { updateWhen, updateUnless } from './functions/conditionalOperations.js';
import { validateState } from './functions/validation.js';
import { createLens, propertyLens, pathLens } from './functions/lenses.js';
import { combineStates } from './functions/composition.js';
import { persistState, loadPersistedState } from './functions/persistence.js';
import { createStateLogger } from './functions/debugging.js';

// Export state management utilities
export const STATE_UTILS = Object.freeze({
    createState,
    createReducer,
    updateProperty,
    setProperty,
    deleteProperty,
    appendToArray,
    prependToArray,
    removeFromArray,
    updateArrayItem,
    mergeObject,
    updateWhen,
    updateUnless,
    validateState,
    createLens,
    propertyLens,
    pathLens,
    combineStates,
    persistState,
    loadPersistedState,
    createStateLogger
});
