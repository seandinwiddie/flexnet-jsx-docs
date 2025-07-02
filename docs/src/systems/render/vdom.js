// === FlexNet Virtual DOM System ===
// Pure functional Virtual DOM implementation

import Maybe from '../../core/types/maybe.js';
import Either from '../../core/types/either.js';
import Result from '../../core/types/result.js';
import { compose, pipe, curry } from '../../core/functions/composition.js';

// Virtual Node types
export const VNodeType = Object.freeze({
    ELEMENT: 'element',
    TEXT: 'text',
    COMPONENT: 'component',
    FRAGMENT: 'fragment'
});

// Create virtual element node
export const createElement = (type, props = {}, ...children) =>
    Result.fromTry(() => {
        const flatChildren = children
            .flat(Infinity)
            .filter(child => child !== null && child !== undefined)
            .map(child => 
                typeof child === 'string' || typeof child === 'number'
                    ? createTextNode(String(child))
                    : child
            );

        return Object.freeze({
            type,
            props: Object.freeze({ ...props }),
            children: Object.freeze(flatChildren),
            nodeType: VNodeType.ELEMENT,
            key: props.key || null,
            _isVNode: true
        });
    });

// Create virtual text node
export const createTextNode = (text) =>
    Object.freeze({
        type: 'text',
        text: String(text || ''),
        nodeType: VNodeType.TEXT,
        _isVNode: true
    });

// Create virtual component node
export const createComponent = (Component, props = {}, ...children) =>
    Result.fromTry(() => {
        if (typeof Component !== 'function') {
            throw new Error('Component must be a function');
        }

        return Object.freeze({
            type: Component,
            props: Object.freeze({ 
                ...props,
                children: children.length > 0 ? Object.freeze(children) : undefined
            }),
            nodeType: VNodeType.COMPONENT,
            key: props.key || null,
            _isVNode: true
        });
    });

// Create virtual fragment
export const createFragment = (...children) =>
    Object.freeze({
        type: 'fragment',
        children: Object.freeze(children.flat(Infinity)),
        nodeType: VNodeType.FRAGMENT,
        _isVNode: true
    });

// Virtual DOM validation
export const isVNode = (node) =>
    Maybe.fromNullable(node)
        .map(n => Boolean(n._isVNode))
        .getOrElse(false);

export const getNodeType = (node) =>
    Maybe.fromNullable(node)
        .chain(n => isVNode(n) ? Maybe.Just(n.nodeType) : Maybe.Nothing());

// Virtual DOM tree traversal
export const walkVTree = curry((visitor, vnode) => {
    if (!isVNode(vnode)) {
        return vnode;
    }

    // Visit current node
    const visited = visitor(vnode);
    
    // Recursively walk children
    if (visited.children && Array.isArray(visited.children)) {
        const newChildren = visited.children.map(child => 
            isVNode(child) ? walkVTree(visitor, child) : child
        );
        
        return Object.freeze({
            ...visited,
            children: Object.freeze(newChildren)
        });
    }

    return visited;
});

// Map over virtual DOM tree
export const mapVTree = curry((mapper, vnode) =>
    walkVTree(mapper, vnode)
);

// Filter virtual DOM tree
export const filterVTree = curry((predicate, vnode) => {
    if (!isVNode(vnode)) {
        return vnode;
    }

    if (!predicate(vnode)) {
        return null;
    }

    if (vnode.children && Array.isArray(vnode.children)) {
        const filteredChildren = vnode.children
            .map(child => filterVTree(predicate, child))
            .filter(child => child !== null);

        return Object.freeze({
            ...vnode,
            children: Object.freeze(filteredChildren)
        });
    }

    return vnode;
});

// Virtual DOM diffing algorithm
export const diff = (oldVNode, newVNode) => {
    const patches = [];

    // Helper function to create patches
    const createPatch = (type, path, data) => Object.freeze({
        type,
        path: Object.freeze([...path]),
        data: Object.freeze(data),
        timestamp: Date.now()
    });

    // Recursive diff function
    const diffNodes = (oldNode, newNode, path = []) => {
        // Both null/undefined - no change
        if (!oldNode && !newNode) {
            return;
        }

        // New node added
        if (!oldNode && newNode) {
            patches.push(createPatch('CREATE', path, { node: newNode }));
            return;
        }

        // Node removed
        if (oldNode && !newNode) {
            patches.push(createPatch('REMOVE', path, {}));
            return;
        }

        // Different node types - replace
        if (oldNode.nodeType !== newNode.nodeType || oldNode.type !== newNode.type) {
            patches.push(createPatch('REPLACE', path, { node: newNode }));
            return;
        }

        // Text node content changed
        if (oldNode.nodeType === VNodeType.TEXT && oldNode.text !== newNode.text) {
            patches.push(createPatch('TEXT', path, { text: newNode.text }));
            return;
        }

        // Element or component props changed
        if (oldNode.nodeType === VNodeType.ELEMENT || oldNode.nodeType === VNodeType.COMPONENT) {
            const propsDiff = diffProps(oldNode.props || {}, newNode.props || {});
            if (propsDiff.length > 0) {
                patches.push(createPatch('PROPS', path, { props: propsDiff }));
            }
        }

        // Diff children
        if (oldNode.children || newNode.children) {
            diffChildren(
                oldNode.children || [],
                newNode.children || [],
                path
            );
        }
    };

    // Diff properties
    const diffProps = (oldProps, newProps) => {
        const propChanges = [];
        const allKeys = new Set([...Object.keys(oldProps), ...Object.keys(newProps)]);

        allKeys.forEach(key => {
            if (key === 'children') return; // Handle children separately

            const oldValue = oldProps[key];
            const newValue = newProps[key];

            if (oldValue !== newValue) {
                propChanges.push({
                    key,
                    oldValue,
                    newValue,
                    type: oldValue === undefined ? 'add' : 
                          newValue === undefined ? 'remove' : 'update'
                });
            }
        });

        return propChanges;
    };

    // Diff children arrays
    const diffChildren = (oldChildren, newChildren, path) => {
        const maxLength = Math.max(oldChildren.length, newChildren.length);

        for (let i = 0; i < maxLength; i++) {
            const oldChild = oldChildren[i];
            const newChild = newChildren[i];
            const childPath = [...path, 'children', i];

            diffNodes(oldChild, newChild, childPath);
        }
    };

    // Start diffing from root
    diffNodes(oldVNode, newVNode);

    return Object.freeze(patches);
};

// Apply patches to virtual DOM
export const applyPatches = curry((patches, vnode) => {
    if (!patches.length) {
        return vnode;
    }

    let result = vnode;

    patches.forEach(patch => {
        result = applyPatch(patch, result);
    });

    return result;
});

// Apply single patch
const applyPatch = (patch, vnode) => {
    const { type, path, data } = patch;

    // Helper to navigate to patch location
    const navigateToPath = (node, pathArray) => {
        if (pathArray.length === 0) {
            return node;
        }

        const [head, ...tail] = pathArray;
        
        if (head === 'children' && tail.length > 0) {
            const index = parseInt(tail[0]);
            const remainingPath = tail.slice(1);
            
            if (node.children && node.children[index]) {
                const updatedChild = navigateToPath(node.children[index], remainingPath);
                const newChildren = [...node.children];
                newChildren[index] = updatedChild;
                
                return Object.freeze({
                    ...node,
                    children: Object.freeze(newChildren)
                });
            }
        }

        return node;
    };

    // Helper to update at path
    const updateAtPath = (node, pathArray, updater) => {
        if (pathArray.length === 0) {
            return updater(node);
        }

        const [head, ...tail] = pathArray;

        if (head === 'children' && tail.length > 0) {
            const index = parseInt(tail[0]);
            const remainingPath = tail.slice(1);
            
            if (node.children) {
                const newChildren = [...node.children];
                
                if (remainingPath.length === 0) {
                    // Direct child operation
                    newChildren[index] = updater(newChildren[index]);
                } else {
                    // Recursive operation
                    newChildren[index] = updateAtPath(newChildren[index], remainingPath, updater);
                }
                
                return Object.freeze({
                    ...node,
                    children: Object.freeze(newChildren)
                });
            }
        }

        return node;
    };

    switch (type) {
        case 'CREATE':
            return updateAtPath(vnode, path, () => data.node);

        case 'REMOVE':
            return updateAtPath(vnode, path, () => null);

        case 'REPLACE':
            return updateAtPath(vnode, path, () => data.node);

        case 'TEXT':
            return updateAtPath(vnode, path, node => Object.freeze({
                ...node,
                text: data.text
            }));

        case 'PROPS':
            return updateAtPath(vnode, path, node => {
                const newProps = { ...node.props };
                
                data.props.forEach(propChange => {
                    if (propChange.type === 'remove') {
                        delete newProps[propChange.key];
                    } else {
                        newProps[propChange.key] = propChange.newValue;
                    }
                });

                return Object.freeze({
                    ...node,
                    props: Object.freeze(newProps)
                });
            });

        default:
            console.warn('Unknown patch type:', type);
            return vnode;
    }
};

// Virtual DOM to real DOM conversion
export const render = (vnode, container) =>
    Result.fromTry(() => {
        if (!container || !container.nodeType) {
            throw new Error('Invalid container element');
        }

        const domNode = createDOMNode(vnode);
        container.innerHTML = '';
        container.appendChild(domNode);
        
        return container;
    });

// Create real DOM node from virtual node
const createDOMNode = (vnode) => {
    if (!isVNode(vnode)) {
        return document.createTextNode(String(vnode || ''));
    }

    switch (vnode.nodeType) {
        case VNodeType.TEXT:
            return document.createTextNode(vnode.text);

        case VNodeType.ELEMENT:
            const element = document.createElement(vnode.type);
            
            // Set properties
            if (vnode.props) {
                Object.entries(vnode.props).forEach(([key, value]) => {
                    if (key === 'children') return;
                    
                    if (key.startsWith('on') && typeof value === 'function') {
                        // Event listener
                        const eventName = key.slice(2).toLowerCase();
                        element.addEventListener(eventName, value);
                    } else if (key === 'className') {
                        element.className = value;
                    } else if (key === 'style' && typeof value === 'object') {
                        Object.assign(element.style, value);
                    } else {
                        element.setAttribute(key, value);
                    }
                });
            }
            
            // Append children
            if (vnode.children) {
                vnode.children.forEach(child => {
                    const childNode = createDOMNode(child);
                    element.appendChild(childNode);
                });
            }
            
            return element;

        case VNodeType.COMPONENT:
            // Render component
            const componentResult = vnode.type(vnode.props || {});
            return createDOMNode(componentResult);

        case VNodeType.FRAGMENT:
            const fragment = document.createDocumentFragment();
            
            if (vnode.children) {
                vnode.children.forEach(child => {
                    const childNode = createDOMNode(child);
                    fragment.appendChild(childNode);
                });
            }
            
            return fragment;

        default:
            return document.createTextNode('');
    }
};

// Update real DOM with patches
export const updateDOM = curry((patches, domNode) =>
    Result.fromTry(() => {
        patches.forEach(patch => {
            applyDOMPatch(patch, domNode);
        });
        
        return domNode;
    })
);

// Apply single DOM patch
const applyDOMPatch = (patch, rootNode) => {
    const { type, path, data } = patch;
    
    // Navigate to target DOM node
    const targetNode = navigateDOMPath(rootNode, path);
    if (!targetNode) return;

    switch (type) {
        case 'CREATE':
            const newNode = createDOMNode(data.node);
            targetNode.appendChild(newNode);
            break;

        case 'REMOVE':
            if (targetNode.parentNode) {
                targetNode.parentNode.removeChild(targetNode);
            }
            break;

        case 'REPLACE':
            const replacementNode = createDOMNode(data.node);
            if (targetNode.parentNode) {
                targetNode.parentNode.replaceChild(replacementNode, targetNode);
            }
            break;

        case 'TEXT':
            if (targetNode.nodeType === Node.TEXT_NODE) {
                targetNode.textContent = data.text;
            }
            break;

        case 'PROPS':
            if (targetNode.nodeType === Node.ELEMENT_NODE) {
                data.props.forEach(propChange => {
                    if (propChange.type === 'remove') {
                        targetNode.removeAttribute(propChange.key);
                    } else {
                        targetNode.setAttribute(propChange.key, propChange.newValue);
                    }
                });
            }
            break;
    }
};

// Navigate DOM tree using path
const navigateDOMPath = (node, path) => {
    let current = node;
    
    for (let i = 0; i < path.length; i++) {
        const segment = path[i];
        
        if (segment === 'children' && i + 1 < path.length) {
            const index = parseInt(path[i + 1]);
            current = current.childNodes[index];
            i++; // Skip the index segment
        }
    }
    
    return current;
};

// Virtual DOM utilities
export const cloneVNode = (vnode) =>
    Maybe.fromNullable(vnode)
        .filter(isVNode)
        .map(node => Object.freeze({
            ...node,
            props: node.props ? Object.freeze({ ...node.props }) : undefined,
            children: node.children ? Object.freeze([...node.children]) : undefined
        }))
        .getOrElse(vnode);

export const findVNode = curry((predicate, vnode) => {
    if (!isVNode(vnode)) {
        return Maybe.Nothing();
    }

    if (predicate(vnode)) {
        return Maybe.Just(vnode);
    }

    if (vnode.children) {
        for (const child of vnode.children) {
            const found = findVNode(predicate, child);
            if (found.isSome()) {
                return found;
            }
        }
    }

    return Maybe.Nothing();
});

// Export Virtual DOM utilities
export const VDOM_UTILS = Object.freeze({
    createElement,
    createTextNode,
    createComponent,
    createFragment,
    isVNode,
    getNodeType,
    walkVTree,
    mapVTree,
    filterVTree,
    diff,
    applyPatches,
    render,
    updateDOM,
    cloneVNode,
    findVNode,
    VNodeType
});
