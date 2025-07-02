import Maybe from '../../../core/types/maybe.js';
import { curry } from '../../../core/functions/composition.js';

// Mouse event utilities
export const getMousePosition = (event) =>
    Maybe.fromNullable(event)
        .map(e => ({
            x: e.clientX,
            y: e.clientY,
            pageX: e.pageX,
            pageY: e.pageY,
            screenX: e.screenX,
            screenY: e.screenY
        }));

export const isInsideElement = curry((element, event) =>
    Maybe.fromNullable(element)
        .chain(() => getMousePosition(event))
        .map(pos => {
            const rect = element.getBoundingClientRect();
            return pos.x >= rect.left &&
                   pos.x <= rect.right &&
                   pos.y >= rect.top &&
                   pos.y <= rect.bottom;
        })
        .getOrElse(false)
); 