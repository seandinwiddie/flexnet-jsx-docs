// Bundle core functionality for easy imports
import Maybe from '../types/maybe.js';
import Either from '../types/either.js';
import Result from '../types/result.js';
import { compose, pipe, curry } from '../functions/composition.js';
import { map, filter, reduce } from '../functions/transforms.js';
import { createElement, jsx, render } from './jsx.js';
import { 
    escape, 
    validateInput, 
    validateElementType, 
    sanitizeProps, 
    urlValidator, 
    safeDOMOperation 
} from '../security/functions.js';

// Export all core functionality
export {
    // Types
    Maybe,
    Either,
    Result,
    
    // Functions
    compose,
    pipe,
    curry,
    map,
    filter,
    reduce,
    
    // JSX
    createElement,
    jsx,
    render,
    
    // Security
    escape,
    validateInput,
    validateElementType,
    sanitizeProps,
    urlValidator,
    safeDOMOperation
}; 