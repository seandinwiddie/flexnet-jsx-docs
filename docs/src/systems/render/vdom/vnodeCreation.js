import Either from '../../../core/types/either.js';
import Result from '../../../core/types/result.js';
import { curry } from '../../../core/functions/composition.js';
import { escapeHTML } from '../../../security/xss.js';
import { VNodeType } from './types.js';
import { sanitizeProps, flattenChildren } from './utilities.js';

// ===========================================
// VIRTUAL NODE CREATION
// ===========================================

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

// Create virtual element node
export const createElement = curry((type, props = {}, children = []) => {
    return Result.fromTry(() => {
        if (typeof type !== 'string' && typeof type !== 'function') {
            return Either.Left('Element type must be string or function');
        }

        const sanitizedProps = sanitizeProps(props);
        const flatChildren = flattenChildren(children, createTextNode);

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

// Create virtual fragment node
export const createFragment = (children = []) => {
    const flatChildren = flattenChildren(children, createTextNode);
    
    return Either.Right(Object.freeze({
        type: VNodeType.FRAGMENT,
        children: Object.freeze(flatChildren),
        key: null,
        ref: null
    }));
}; 