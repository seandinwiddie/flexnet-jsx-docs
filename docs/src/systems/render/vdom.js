// === FlexNet Virtual DOM System ===
// Pure functional virtual DOM implementation with diffing and patching

import Maybe from '../../core/types/maybe.js';
import Either from '../../core/types/either.js';
import Result from '../../core/types/result.js';
import { compose, pipe } from '../../core/functions/composition.js';

// Virtual DOM node types
export const VNodeType = {
    ELEMENT: 'ELEMENT',
    TEXT: 'TEXT',
    FRAGMENT: 'FRAGMENT',
    COMPONENT: 'COMPONENT'
};

// Create virtual DOM node - pure function
export const createVNode = (type, props = {}, children = []) => {
    // Validate node type
    if (!type) {
        return Either.Left('VNode type is required');
    }

    // Determine node type
    let nodeType;
    if (typeof type === 'string') {
        nodeType = VNodeType.ELEMENT;
    } else if (typeof type === 'function') {
        nodeType = VNodeType.COMPONENT;
    } else if (type === 'FRAGMENT') {
        nodeType = VNodeType.FRAGMENT;
    } else {
        return Either.Left('Invalid VNode type');
    }

    // Normalize children
    const normalizedChildren = Array.isArray(children) ? children.flat() : [children];
    const validChildren = normalizedChildren.filter(child => child != null);

    const vnode = Object.freeze({
        type,
        nodeType,
        props: Object.freeze({ ...props }),
        children: Object.freeze(validChildren),
        key: props.key || null,
        ref: props.ref || null
    });

    return Either.Right(vnode);
};

// Create text virtual node
export const createTextVNode = (text) => {
    if (typeof text !== 'string' && typeof text !== 'number') {
        return Either.Left('Text node must be string or number');
    }

    const vnode = Object.freeze({
        type: 'TEXT',
        nodeType: VNodeType.TEXT,
        props: Object.freeze({}),
        children: Object.freeze([]),
        text: String(text),
        key: null,
        ref: null
    });

    return Either.Right(vnode);
};

// Create fragment virtual node
export const createFragment = (children = []) => {
    const normalizedChildren = Array.isArray(children) ? children.flat() : [children];
    
    const vnode = Object.freeze({
        type: 'FRAGMENT',
        nodeType: VNodeType.FRAGMENT,
        props: Object.freeze({}),
        children: Object.freeze(normalizedChildren),
        key: null,
        ref: null
    });

    return Either.Right(vnode);
};

// Virtual DOM diffing algorithm
export const diff = (oldVNode, newVNode) => {
    const patches = [];

    const diffNodes = (oldNode, newNode, index = 0) => {
        // Case 1: New node doesn't exist (removal)
        if (!newNode) {
            patches.push({
                type: 'REMOVE',
                index
            });
            return patches;
        }

        // Case 2: Old node doesn't exist (addition)
        if (!oldNode) {
            patches.push({
                type: 'CREATE',
                index,
                vnode: newNode
            });
            return patches;
        }

        // Case 3: Node type changed (replacement)
        if (oldNode.type !== newNode.type || oldNode.nodeType !== newNode.nodeType) {
            patches.push({
                type: 'REPLACE',
                index,
                vnode: newNode
            });
            return patches;
        }

        // Case 4: Text node update
        if (newNode.nodeType === VNodeType.TEXT) {
            if (oldNode.text !== newNode.text) {
                patches.push({
                    type: 'TEXT',
                    index,
                    text: newNode.text
                });
            }
            return patches;
        }

        // Case 5: Props update
        const propsDiff = diffProps(oldNode.props, newNode.props);
        if (propsDiff.length > 0) {
            patches.push({
                type: 'PROPS',
                index,
                props: propsDiff
            });
        }

        // Case 6: Children diff
        diffChildren(oldNode.children, newNode.children, index, patches);

        return patches;
    };

    return Either.Right(diffNodes(oldVNode, newVNode));
};

// Diff props between old and new vnodes
const diffProps = (oldProps, newProps) => {
    const patches = [];
    const allKeys = new Set([...Object.keys(oldProps), ...Object.keys(newProps)]);

    for (const key of allKeys) {
        const oldValue = oldProps[key];
        const newValue = newProps[key];

        if (oldValue !== newValue) {
            if (newValue === undefined) {
                patches.push({ type: 'REMOVE_PROP', key });
            } else {
                patches.push({ type: 'SET_PROP', key, value: newValue });
            }
        }
    }

    return patches;
};

// Diff children arrays
const diffChildren = (oldChildren, newChildren, parentIndex, patches) => {
    const oldLength = oldChildren.length;
    const newLength = newChildren.length;
    const maxLength = Math.max(oldLength, newLength);

    for (let i = 0; i < maxLength; i++) {
        const oldChild = oldChildren[i];
        const newChild = newChildren[i];
        const childIndex = parentIndex * 1000 + i; // Simple indexing strategy

        diff(oldChild, newChild).fold(
            error => console.error('Child diff error:', error),
            childPatches => patches.push(...childPatches)
        );
    }
};

// Apply patches to real DOM - this isolates side effects
export const patch = (rootElement, patches) => {
    if (!rootElement) {
        return Either.Left('Root element is required for patching');
    }

    if (!Array.isArray(patches)) {
        return Either.Left('Patches must be an array');
    }

    const applyPatch = (element, patchItem) => {
        return Result.fromTry(() => {
            switch (patchItem.type) {
                case 'CREATE':
                    const newElement = render(patchItem.vnode);
                    if (newElement.type === 'Right') {
                        element.appendChild(newElement.value);
                    }
                    break;

                case 'REMOVE':
                    if (element.parentNode) {
                        element.parentNode.removeChild(element);
                    }
                    break;

                case 'REPLACE':
                    const replacementElement = render(patchItem.vnode);
                    if (replacementElement.type === 'Right' && element.parentNode) {
                        element.parentNode.replaceChild(replacementElement.value, element);
                    }
                    break;

                case 'TEXT':
                    element.textContent = patchItem.text;
                    break;

                case 'PROPS':
                    patchItem.props.forEach(propPatch => {
                        if (propPatch.type === 'SET_PROP') {
                            element.setAttribute(propPatch.key, propPatch.value);
                        } else if (propPatch.type === 'REMOVE_PROP') {
                            element.removeAttribute(propPatch.key);
                        }
                    });
                    break;

                default:
                    throw new Error(`Unknown patch type: ${patchItem.type}`);
            }
        });
    };

    const results = patches.map(patchItem => applyPatch(rootElement, patchItem));
    const errors = results.filter(result => result.type === 'Error');

    if (errors.length > 0) {
        return Either.Left(`Patch errors: ${errors.map(e => e.error.message).join(', ')}`);
    }

    return Either.Right(rootElement);
};

// Render virtual DOM to real DOM - isolates side effects
export const render = (vnode) => {
    if (!vnode) {
        return Either.Left('VNode is required for rendering');
    }

    const renderNode = (node) => {
        return Result.fromTry(() => {
            switch (node.nodeType) {
                case VNodeType.TEXT:
                    return document.createTextNode(node.text);

                case VNodeType.ELEMENT:
                    const element = document.createElement(node.type);
                    
                    // Set props
                    Object.entries(node.props).forEach(([key, value]) => {
                        if (key.startsWith('on') && typeof value === 'function') {
                            // Event listener
                            const eventName = key.slice(2).toLowerCase();
                            element.addEventListener(eventName, value);
                        } else if (key !== 'children' && key !== 'key' && key !== 'ref') {
                            element.setAttribute(key, value);
                        }
                    });

                    // Render children
                    node.children.forEach(child => {
                        const childResult = render(child);
                        if (childResult.type === 'Right') {
                            element.appendChild(childResult.value);
                        }
                    });

                    return element;

                case VNodeType.FRAGMENT:
                    const fragment = document.createDocumentFragment();
                    
                    node.children.forEach(child => {
                        const childResult = render(child);
                        if (childResult.type === 'Right') {
                            fragment.appendChild(childResult.value);
                        }
                    });

                    return fragment;

                case VNodeType.COMPONENT:
                    // For functional components
                    if (typeof node.type === 'function') {
                        const componentResult = node.type(node.props);
                        return render(componentResult);
                    }
                    throw new Error('Invalid component type');

                default:
                    throw new Error(`Unknown node type: ${node.nodeType}`);
            }
        });
    };

    return renderNode(vnode);
};

// Virtual DOM tree traversal
export const traverse = (visitor) => (vnode) => {
    if (!vnode) {
        return Either.Right(null);
    }

    const visitNode = (node) => {
        // Visit current node
        const visitResult = Result.fromTry(() => visitor(node));
        
        if (visitResult.type === 'Error') {
            return Either.Left(`Visitor error: ${visitResult.error.message}`);
        }

        // Visit children
        if (node.children && node.children.length > 0) {
            const childResults = node.children.map(child => traverse(visitor)(child));
            const childErrors = childResults.filter(result => result.type === 'Left');
            
            if (childErrors.length > 0) {
                return childErrors[0]; // Return first error
            }
        }

        return Either.Right(visitResult.value);
    };

    return visitNode(vnode);
};

// Find nodes by predicate
export const findNodes = (predicate) => (vnode) => {
    const found = [];
    
    const finder = (node) => {
        const predicateResult = Result.fromTry(() => predicate(node));
        
        if (predicateResult.type === 'Ok' && predicateResult.value) {
            found.push(node);
        }

        return Either.Right(node);
    };

    const result = traverse(finder)(vnode);
    
    if (result.type === 'Left') {
        return result;
    }

    return Either.Right(found);
};

// Clone virtual node with modifications
export const cloneVNode = (vnode, newProps = {}, newChildren = null) => {
    if (!vnode) {
        return Either.Left('VNode is required for cloning');
    }

    const mergedProps = { ...vnode.props, ...newProps };
    const finalChildren = newChildren !== null ? newChildren : vnode.children;

    return createVNode(vnode.type, mergedProps, finalChildren);
};

// Validate virtual DOM tree
export const validateVTree = (vnode) => {
    const validator = (node) => {
        if (!node.type || !node.nodeType) {
            throw new Error('VNode missing required properties');
        }

        if (node.nodeType === VNodeType.TEXT && !('text' in node)) {
            throw new Error('Text VNode missing text property');
        }

        if (!node.props || !Array.isArray(node.children)) {
            throw new Error('VNode missing props or children');
        }

        return Either.Right(node);
    };

    return traverse(validator)(vnode);
};

// Export VDOM utilities
export const VDOMUtils = {
    createVNode,
    createTextVNode,
    createFragment,
    diff,
    patch,
    render,
    traverse,
    findNodes,
    cloneVNode,
    validateVTree,
    VNodeType
};
