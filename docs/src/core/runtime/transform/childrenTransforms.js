import { curry } from '../../functions/composition.js';
import { transformChildren } from './coreTransforms.js';

// Element filtering and mapping
export const filterChildren = curry((predicate, element) =>
    transformChildren(children => 
        Array.isArray(children) 
            ? children.filter(predicate)
            : predicate(children) ? children : null
    , element)
);

export const mapChildren = curry((mapper, element) =>
    transformChildren(children =>
        Array.isArray(children)
            ? children.map(mapper)
            : mapper(children)
    , element)
);
