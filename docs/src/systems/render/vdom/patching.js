import Either from '../../../core/types/either.js';
import Result from '../../../core/types/result.js';
import { curry } from '../../../core/functions/composition.js';
import { createDOMNode } from './domCreation.js';
import { setProp, removeProp } from './properties.js';

// ===========================================
// DOM PATCHING
// ===========================================

// Apply patches to real DOM
export const patch = curry((element, patches) => {
    return Result.fromTry(() => {
        if (!element || !element.nodeType) {
            return Either.Left('Invalid container element');
        }

        const applyPatch = (el, patch) => {
            switch (patch.type) {
                case 'CREATE':
                    return createDOMNode(patch.vnode);

                case 'REMOVE':
                    if (el.parentNode) {
                        el.parentNode.removeChild(el);
                    }
                    return Either.Right(null);

                case 'REPLACE':
                    const newElementResult = createDOMNode(patch.newVNode);
                    if (newElementResult.type === 'Right' && el.parentNode) {
                        el.parentNode.replaceChild(newElementResult.value, el);
                        return newElementResult;
                    }
                    return newElementResult;

                case 'PROPS':
                    return applyPropPatches(el, patch.patches);

                case 'CHILDREN':
                    return applyChildPatches(el, patch.patches);

                default:
                    return Either.Left(`Unknown patch type: ${patch.type}`);
            }
        };

        const results = patches.map(patch => applyPatch(element, patch));
        const errors = results.filter(result => result.type === 'Left');
        
        if (errors.length > 0) {
            return Either.Left(`Patch application failed: ${errors.map(e => e.value).join(', ')}`);
        }

        return Either.Right(element);
    }).fold(
        (error) => Either.Left(`Patching failed: ${error}`),
        (result) => result
    );
});

// Apply property patches
export const applyPropPatches = (element, propPatches) => {
    return Result.fromTry(() => {
        propPatches.forEach(patch => {
            switch (patch.type) {
                case 'SET_PROP':
                    setProp(element, patch.key, patch.value);
                    break;
                case 'REMOVE_PROP':
                    removeProp(element, patch.key);
                    break;
            }
        });
        return Either.Right(element);
    }).fold(
        (error) => Either.Left(`Property patch failed: ${error}`),
        (result) => result
    );
};

// Apply child patches
export const applyChildPatches = (element, childPatches) => {
    return Result.fromTry(() => {
        childPatches.forEach(patch => {
            switch (patch.type) {
                case 'ADD_CHILD':
                    const newChildResult = createDOMNode(patch.vnode);
                    if (newChildResult.type === 'Right') {
                        element.appendChild(newChildResult.value);
                    }
                    break;

                case 'REMOVE_CHILD':
                    const childToRemove = element.childNodes[patch.index];
                    if (childToRemove) {
                        element.removeChild(childToRemove);
                    }
                    break;

                case 'UPDATE_CHILD':
                    const childToUpdate = element.childNodes[patch.index];
                    if (childToUpdate) {
                        patch(childToUpdate, patch.patches);
                    }
                    break;
            }
        });
        return Either.Right(element);
    }).fold(
        (error) => Either.Left(`Child patch failed: ${error}`),
        (result) => result
    );
}; 