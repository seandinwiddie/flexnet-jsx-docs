import Maybe from '../../types/maybe.js';
import { curry } from '../../functions/composition.js';

// Props transformation utilities
export const addProp = curry((key, value, props) =>
    Object.freeze({ ...props, [key]: value })
);

export const removeProp = curry((key, props) => {
    const { [key]: removed, ...rest } = props;
    return Object.freeze(rest);
});

export const updateProp = curry((key, updater, props) =>
    Maybe.fromNullable(props[key])
        .map(updater)
        .map(newValue => addProp(key, newValue, props))
        .getOrElse(props)
);
