import Either from '../../../core/types/either.js';
import Result from '../../../core/types/result.js';
import { curry } from '../../../core/functions/composition.js';
import { createDOMNode } from './domCreation.js';

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