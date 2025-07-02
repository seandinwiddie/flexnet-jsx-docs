// === Virtual DOM Implementation ===
// Pure functional virtual DOM with immutable operations

import Maybe from '../../core/types/maybe.js';
import Either from '../../core/types/either.js';
import Result from '../../core/types/result.js';
import { compose, pipe, curry } from '../../core/functions/composition.js';
import { deepFreeze } from '../../utils/immutable.js';
import { sanitizeHTML, escapeHTML } from '../../security/xss.js';

// ===========================================
// VIRTUAL NODE TYPES
// ===========================================

export const VNodeType = Object.freeze({
    ELEMENT: 'element',
    TEXT: 'text',
    COMPONENT: 'component',
    FRAGMENT: 'fragment'
});

// ===========================================
// VIRTUAL NODE CREATION
// ===========================================

// Create virtual element node
export const createElement = curry((type, props = {}, children = []) => {
    return Result.fromTry(() => {
        if (typeof type !== 'string' && typeof type !== 'function') {
            return Either.Left('Element type must be string or function');
        }

        const sanitizedProps = sanitizeProps(props);
        const flatChildren = flattenChildren(children);

        const vnode = {
            type: typeof type === 'function' ? VNodeType.COMPONENT : VNodeType.ELEMENT,
            elementType: type,
            props: Object.freeze(sanitizedProps),
            children: Object.freeze(flatChildren),
            key: props.key || null,
            ref: props.ref || null
        };

        return Either.Right(Object.freeze(vnode));
    }).fold(
        (error) => Either.Left(`Failed to create element: ${error}`),
        (result) => result
    );
});

// Create virtual text node
export const createTextNode = (text) => {
    const sanitizedText = typeof text === 'string' ? escapeHTML(text) : String(text);
    
    return Either.Right(Object.freeze({
        type: VNodeType.TEXT,
        text: sanitizedText,
        children: [],
        key: null,
        ref: null
    }));
};

// Create virtual fragment node
export const createFragment = (children = []) => {
    const flatChildren = flattenChildren(children);
    
    return Either.Right(Object.freeze({
        type: VNodeType.FRAGMENT,
        children: Object.freeze(flatChildren),
        key: null,
        ref: null
    }));
};

// ===========================================
// COMPONENT HANDLING
// ===========================================

// Render component function
export const renderComponent = (component, props = {}) => {
    return Result.fromTry(() => {
        if (typeof component !== 'function') {
            return Either.Left('Component must be a function');
        }

        const result = component(props);
        
        if (!result || typeof result !== 'object') {
            return Either.Left('Component must return a virtual node');
        }

        return Either.Right(result);
    }).fold(
        (error) => Either.Left(`Component render failed: ${error}`),
        (result) => result
    );
};

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
const diffProps = (oldProps, newProps) => {
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
const diffChildren = (oldChildren, newChildren) => {
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
const applyPropPatches = (element, propPatches) => {
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
const applyChildPatches = (element, childPatches) => {
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

// ===========================================
// DOM NODE CREATION
// ===========================================

// Create real DOM node from virtual node
export const createDOMNode = (vnode) => {
    return Result.fromTry(() => {
        if (!vnode) {
            return Either.Left('Virtual node is required');
        }

        switch (vnode.type) {
            case VNodeType.TEXT:
                const textNode = document.createTextNode(vnode.text);
                return Either.Right(textNode);

            case VNodeType.ELEMENT:
                const element = document.createElement(vnode.elementType);
                
                // Set properties
                Object.entries(vnode.props || {}).forEach(([key, value]) => {
                    setProp(element, key, value);
                });
                
                // Add children
                (vnode.children || []).forEach(child => {
                    const childResult = createDOMNode(child);
                    if (childResult.type === 'Right') {
                        element.appendChild(childResult.value);
                    }
                });
                
                return Either.Right(element);

            case VNodeType.COMPONENT:
                const componentResult = renderComponent(vnode.elementType, vnode.props);
                if (componentResult.type === 'Right') {
                    return createDOMNode(componentResult.value);
                }
                return componentResult;

            case VNodeType.FRAGMENT:
                const fragment = document.createDocumentFragment();
                (vnode.children || []).forEach(child => {
                    const childResult = createDOMNode(child);
                    if (childResult.type === 'Right') {
                        fragment.appendChild(childResult.value);
                    }
                });
                return Either.Right(fragment);

            default:
                return Either.Left(`Unknown virtual node type: ${vnode.type}`);
        }
    }).fold(
        (error) => Either.Left(`DOM node creation failed: ${error}`),
        (result) => result
    );
};

// ===========================================
// PROPERTY HANDLING
// ===========================================

// Set property on DOM element
const setProp = (element, key, value) => {
    if (key === 'key' || key === 'ref') {
        return; // Skip special props
    }

    if (key.startsWith('on') && typeof value === 'function') {
        // Event listener
        const eventName = key.slice(2).toLowerCase();
        element.addEventListener(eventName, value);
    } else if (key === 'className') {
        element.className = value;
    } else if (key === 'style' && typeof value === 'object') {
        Object.assign(element.style, value);
    } else if (key in element) {
        element[key] = value;
    } else {
        element.setAttribute(key, value);
    }
};

// Remove property from DOM element
const removeProp = (element, key) => {
    if (key === 'key' || key === 'ref') {
        return; // Skip special props
    }

    if (key.startsWith('on')) {
        // Remove event listener - would need to track original function
        // This is a limitation of the functional approach
        return;
    } else if (key === 'className') {
        element.className = '';
    } else if (key === 'style') {
        element.style.cssText = '';
    } else if (key in element) {
        element[key] = '';
    } else {
        element.removeAttribute(key);
    }
};

// ===========================================
// UTILITY FUNCTIONS
// ===========================================

// Sanitize props object
const sanitizeProps = (props) => {
    const sanitized = {};
    
    Object.entries(props || {}).forEach(([key, value]) => {
        if (typeof value === 'string' && !key.startsWith('on')) {
            sanitized[key] = sanitizeHTML(value);
        } else {
            sanitized[key] = value;
        }
    });
    
    return sanitized;
};

// Flatten children array
const flattenChildren = (children) => {
    const flattened = [];
    
    const flatten = (items) => {
        items.forEach(item => {
            if (Array.isArray(item)) {
                flatten(item);
            } else if (item != null && item !== false) {
                if (typeof item === 'string' || typeof item === 'number') {
                    const textNodeResult = createTextNode(item);
                    if (textNodeResult.type === 'Right') {
                        flattened.push(textNodeResult.value);
                    }
                } else {
                    flattened.push(item);
                }
            }
        });
    };
    
    flatten(children);
    return flattened;
};

// Create set from keys without constructor
const createSetFromKeys = (keys) => {
    const uniqueKeys = [];
    keys.forEach(key => {
        if (!uniqueKeys.includes(key)) {
            uniqueKeys.push(key);
        }
    });
    return uniqueKeys;
};

// ===========================================
// RENDER FUNCTION
// ===========================================

// Main render function
export const render = curry((vnode, container) => {
    return Result.fromTry(() => {
        if (!container || !container.nodeType) {
            return Either.Left('Invalid container element');
        }

        // Clear container
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        // Create and append new DOM tree
        const domNodeResult = createDOMNode(vnode);
        if (domNodeResult.type === 'Right') {
            container.appendChild(domNodeResult.value);
            return Either.Right(container);
        }
        
        return domNodeResult;
    }).fold(
        (error) => Either.Left(`Render failed: ${error}`),
        (result) => result
    );
});

// ===========================================
// EXPORTS
// ===========================================

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
