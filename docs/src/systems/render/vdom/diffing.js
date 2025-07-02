import Either from '../../../core/types/either.js';
import Result from '../../../core/types/result.js';
import { curry } from '../../../core/functions/composition.js';
import { createSetFromKeys } from './utilities.js';

// ===========================================
// VIRTUAL DOM OPERATIONS
// ===========================================

// Diff two virtual DOM trees
export const diff = curry((oldVNode, newVNode) => {
    return Result.fromTry(() => {
        // Handle null/undefined cases
        if (!oldVNode && !newVNode) {
            return Either.Right([]);
        }
        
        if (!oldVNode) {
            return Either.Right([{ type: 'CREATE', vnode: newVNode }]);
        }
        
        if (!newVNode) {
            return Either.Right([{ type: 'REMOVE', vnode: oldVNode }]);
        }

        // Different node types - replace
        if (oldVNode.type !== newVNode.type || 
            oldVNode.elementType !== newVNode.elementType) {
            return Either.Right([{ type: 'REPLACE', oldVNode, newVNode }]);
        }

        const patches = [];

        // Diff props
        const propPatches = diffProps(oldVNode.props || {}, newVNode.props || {});
        if (propPatches.length > 0) {
            patches.push({ type: 'PROPS', patches: propPatches });
        }

        // Diff children
        const childPatches = diffChildren(oldVNode.children || [], newVNode.children || []);
        if (childPatches.length > 0) {
            patches.push({ type: 'CHILDREN', patches: childPatches });
        }

        return Either.Right(patches);
    }).fold(
        (error) => Either.Left(`Diff failed: ${error}`),
        (result) => result
    );
});

// Diff properties
export const diffProps = (oldProps, newProps) => {
    const patches = [];
    const allKeys = createSetFromKeys([...Object.keys(oldProps), ...Object.keys(newProps)]);

    allKeys.forEach(key => {
        const oldValue = oldProps[key];
        const newValue = newProps[key];

        if (oldValue !== newValue) {
            if (newValue === undefined) {
                patches.push({ type: 'REMOVE_PROP', key });
            } else {
                patches.push({ type: 'SET_PROP', key, value: newValue });
            }
        }
    });

    return patches;
};

// Diff children arrays
export const diffChildren = (oldChildren, newChildren) => {
    const patches = [];
    const maxLength = Math.max(oldChildren.length, newChildren.length);

    for (let i = 0; i < maxLength; i++) {
        const oldChild = oldChildren[i];
        const newChild = newChildren[i];

        if (!oldChild && newChild) {
            // New child added
            patches.push({ type: 'ADD_CHILD', index: i, vnode: newChild });
        } else if (oldChild && !newChild) {
            // Child removed
            patches.push({ type: 'REMOVE_CHILD', index: i, vnode: oldChild });
        } else if (oldChild && newChild) {
            // Existing child - recurse
            const childDiff = diff(oldChild, newChild);
            if (childDiff.type === 'Right' && childDiff.value.length > 0) {
                patches.push({ type: 'UPDATE_CHILD', index: i, patches: childDiff.value });
            }
        }
    }

    return patches;
}; 