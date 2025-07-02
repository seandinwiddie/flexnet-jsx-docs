import Maybe from '../../../core/types/maybe.js';
import Either from '../../../core/types/either.js';
import { escapeHTML } from '../../../security/xss.js';

// DOM effect executor
export const executeDOMEffect = (effect) => {
    const { operation, payload } = effect;

    switch (operation) {
        case 'query':
            return Maybe.fromNullable(document.querySelector(payload.selector));

        case 'queryAll':
            const elements = document.querySelectorAll(payload.selector);
            return Maybe.Just(Array.from(elements));

        case 'getElementById':
            return Maybe.fromNullable(document.getElementById(payload.id));

        case 'setTextContent':
            if (payload.element && payload.element.nodeType) {
                payload.element.textContent = escapeHTML(payload.text);
                return Either.Right(payload.element);
            }
            return Either.Left('Invalid element for setTextContent');

        case 'setHTML':
            if (payload.element && payload.element.nodeType) {
                payload.element.innerHTML = escapeHTML(payload.html);
                return Either.Right(payload.element);
            }
            return Either.Left('Invalid element for setHTML');

        case 'setAttribute':
            if (payload.element && payload.element.setAttribute) {
                payload.element.setAttribute(payload.name, payload.value);
                return Either.Right(payload.element);
            }
            return Either.Left('Invalid element for setAttribute');

        case 'removeAttribute':
            if (payload.element && payload.element.removeAttribute) {
                payload.element.removeAttribute(payload.name);
                return Either.Right(payload.element);
            }
            return Either.Left('Invalid element for removeAttribute');

        case 'addClass':
            if (payload.element && payload.element.classList) {
                payload.element.classList.add(payload.className);
                return Either.Right(payload.element);
            }
            return Either.Left('Invalid element for addClass');

        case 'removeClass':
            if (payload.element && payload.element.classList) {
                payload.element.classList.remove(payload.className);
                return Either.Right(payload.element);
            }
            return Either.Left('Invalid element for removeClass');

        case 'hasClass':
            if (payload.element && payload.element.classList) {
                return Either.Right(payload.element.classList.contains(payload.className));
            }
            return Either.Left('Invalid element for hasClass');

        case 'setStyle':
            if (payload.element && payload.element.style) {
                payload.element.style[payload.property] = payload.value;
                return Either.Right(payload.element);
            }
            return Either.Left('Invalid element for setStyle');

        case 'addEventListener':
            if (payload.element && payload.element.addEventListener) {
                payload.element.addEventListener(payload.event, payload.handler, payload.options);
                return Either.Right(() => payload.element.removeEventListener(payload.event, payload.handler, payload.options));
            }
            return Either.Left('Invalid element for addEventListener');

        case 'removeEventListener':
            if (payload.element && payload.element.removeEventListener) {
                payload.element.removeEventListener(payload.event, payload.handler, payload.options);
                return Either.Right(payload.element);
            }
            return Either.Left('Invalid element for removeEventListener');

        case 'createElement':
            return Either.Right(document.createElement(payload.tagName));

        case 'appendChild':
            if (payload.parent && payload.child && payload.parent.appendChild) {
                payload.parent.appendChild(payload.child);
                return Either.Right(payload.parent);
            }
            return Either.Left('Invalid elements for appendChild');

        case 'removeChild':
            if (payload.parent && payload.child && payload.parent.removeChild) {
                payload.parent.removeChild(payload.child);
                return Either.Right(payload.parent);
            }
            return Either.Left('Invalid elements for removeChild');

        case 'focus':
            if (payload.element && payload.element.focus) {
                payload.element.focus();
                return Either.Right(payload.element);
            }
            return Either.Left('Invalid element for focus');

        case 'scrollTo':
            if (payload.element && payload.element.scrollIntoView) {
                payload.element.scrollIntoView(payload.options);
                return Either.Right(payload.element);
            }
            return Either.Left('Invalid element for scrollTo');

        case 'domReady':
            if (document.readyState === 'loading') {
                return new Promise(resolve => {
                    const handler = () => {
                        resolve(Either.Right(document));
                        document.removeEventListener('DOMContentLoaded', handler);
                    };
                    document.addEventListener('DOMContentLoaded', handler);
                });
            } else {
                return Promise.resolve(Either.Right(document));
            }

        default:
            return Either.Left(`Unknown DOM operation: ${operation}`);
    }
}; 