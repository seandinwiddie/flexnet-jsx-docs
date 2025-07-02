import Either from '../../../core/types/either.js';
import Result from '../../../core/types/result.js';
import { VNodeType } from './types.js';
import { renderComponent } from './componentHandling.js';
import { setProp } from './properties.js';

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