// === Event Effects ===
// Pure functional event handling using Effect type
// All effects return Either<Error, Success> for proper error handling

import { Effect } from './effect.js';
import Either from '../../../core/types/either.js';
import Maybe from '../../../core/types/maybe.js';

/**
 * Pure effect to add an event listener to an element
 * @param {Element} element - Target element
 * @param {string} event - Event type
 * @param {Function} handler - Event handler function
 * @param {Object} options - Event listener options
 * @returns {Effect} Effect that returns Either<Error, EventBinding>
 */
export const addEventListener = (element, event, handler, options = {}) =>
    Effect(() => {
        const validateElement = (el) =>
            el && typeof el.addEventListener === 'function'
                ? Either.Right(el)
                : Either.Left('Element must have addEventListener method');

        const validateEvent = (eventType) =>
            typeof eventType === 'string' && eventType.trim()
                ? Either.Right(eventType.trim())
                : Either.Left('Event type must be a non-empty string');

        const validateHandler = (handlerFn) =>
            typeof handlerFn === 'function'
                ? Either.Right(handlerFn)
                : Either.Left('Handler must be a function');

        const validateOptions = (opts) =>
            opts && typeof opts === 'object'
                ? Either.Right(opts)
                : Either.Right({});

        return Either.chain(validElement =>
            Either.chain(validEvent =>
                Either.chain(validHandler =>
                    Either.chain(validOptions => {
                        try {
                            validElement.addEventListener(validEvent, validHandler, validOptions);
                            return Either.Right(Object.freeze({
                                element: validElement,
                                event: validEvent,
                                handler: validHandler,
                                options: validOptions,
                                timestamp: Date.now()
                            }));
                        } catch (error) {
                            return Either.Left(`addEventListener failed: ${error.message}`);
                        }
                    })(validateOptions(options))
                )(validateHandler(handler))
            )(validateEvent(event))
        )(validateElement(element));
    });

/**
 * Pure effect to remove an event listener from an element
 * @param {Element} element - Target element
 * @param {string} event - Event type
 * @param {Function} handler - Event handler function
 * @param {Object} options - Event listener options
 * @returns {Effect} Effect that returns Either<Error, EventUnbinding>
 */
export const removeEventListener = (element, event, handler, options = {}) =>
    Effect(() => {
        const validateElement = (el) =>
            el && typeof el.removeEventListener === 'function'
                ? Either.Right(el)
                : Either.Left('Element must have removeEventListener method');

        const validateEvent = (eventType) =>
            typeof eventType === 'string' && eventType.trim()
                ? Either.Right(eventType.trim())
                : Either.Left('Event type must be a non-empty string');

        const validateHandler = (handlerFn) =>
            typeof handlerFn === 'function'
                ? Either.Right(handlerFn)
                : Either.Left('Handler must be a function');

        const validateOptions = (opts) =>
            opts && typeof opts === 'object'
                ? Either.Right(opts)
                : Either.Right({});

        return Either.chain(validElement =>
            Either.chain(validEvent =>
                Either.chain(validHandler =>
                    Either.chain(validOptions => {
                        try {
                            validElement.removeEventListener(validEvent, validHandler, validOptions);
                            return Either.Right(Object.freeze({
                                element: validElement,
                                event: validEvent,
                                handler: validHandler,
                                options: validOptions,
                                removed: true,
                                timestamp: Date.now()
                            }));
                        } catch (error) {
                            return Either.Left(`removeEventListener failed: ${error.message}`);
                        }
                    })(validateOptions(options))
                )(validateHandler(handler))
            )(validateEvent(event))
        )(validateElement(element));
    });

/**
 * Pure effect to dispatch a custom event
 * @param {Element} element - Target element
 * @param {string} eventType - Custom event type
 * @param {*} detail - Event detail data
 * @param {Object} options - Event options
 * @returns {Effect} Effect that returns Either<Error, CustomEvent>
 */
export const dispatchCustomEvent = (element, eventType, detail = null, options = {}) =>
    Effect(() => {
        const validateElement = (el) =>
            el && typeof el.dispatchEvent === 'function'
                ? Either.Right(el)
                : Either.Left('Element must have dispatchEvent method');

        const validateEventType = (type) =>
            typeof type === 'string' && type.trim()
                ? Either.Right(type.trim())
                : Either.Left('Event type must be a non-empty string');

        const validateOptions = (opts) =>
            opts && typeof opts === 'object'
                ? Either.Right({ bubbles: true, cancelable: true, ...opts })
                : Either.Right({ bubbles: true, cancelable: true });

        return Either.chain(validElement =>
            Either.chain(validType =>
                Either.chain(validOptions => {
                    try {
                        const customEvent = new CustomEvent(validType, {
                            ...validOptions,
                            detail: detail
                        });
                        
                        const dispatched = validElement.dispatchEvent(customEvent);
                        
                        return Either.Right(Object.freeze({
                            element: validElement,
                            event: customEvent,
                            dispatched: dispatched,
                            timestamp: Date.now()
                        }));
                    } catch (error) {
                        return Either.Left(`Custom event dispatch failed: ${error.message}`);
                    }
                })(validateOptions(options))
            )(validateEventType(eventType))
        )(validateElement(element));
    });

/**
 * Pure effect to create a delegated event listener
 * @param {Element} container - Container element
 * @param {string} selector - CSS selector for target elements
 * @param {string} event - Event type
 * @param {Function} handler - Event handler function
 * @returns {Effect} Effect that returns Either<Error, DelegatedEventBinding>
 */
export const addDelegatedEventListener = (container, selector, event, handler) =>
    Effect(() => {
        const validateContainer = (el) =>
            el && typeof el.addEventListener === 'function'
                ? Either.Right(el)
                : Either.Left('Container must have addEventListener method');

        const validateSelector = (sel) =>
            typeof sel === 'string' && sel.trim()
                ? Either.Right(sel.trim())
                : Either.Left('Selector must be a non-empty string');

        const validateEvent = (eventType) =>
            typeof eventType === 'string' && eventType.trim()
                ? Either.Right(eventType.trim())
                : Either.Left('Event type must be a non-empty string');

        const validateHandler = (handlerFn) =>
            typeof handlerFn === 'function'
                ? Either.Right(handlerFn)
                : Either.Left('Handler must be a function');

        return Either.chain(validContainer =>
            Either.chain(validSelector =>
                Either.chain(validEvent =>
                    Either.chain(validHandler => {
                        try {
                            const delegatedHandler = (e) => {
                                const target = e.target.closest(validSelector);
                                if (target && validContainer.contains(target)) {
                                    validHandler.call(target, e);
                                }
                            };

                            validContainer.addEventListener(validEvent, delegatedHandler);

                            return Either.Right(Object.freeze({
                                container: validContainer,
                                selector: validSelector,
                                event: validEvent,
                                handler: validHandler,
                                delegatedHandler: delegatedHandler,
                                timestamp: Date.now()
                            }));
                        } catch (error) {
                            return Either.Left(`Delegated event listener failed: ${error.message}`);
                        }
                    })(validateHandler(handler))
                )(validateEvent(event))
            )(validateSelector(selector))
        )(validateContainer(container));
    });

/**
 * Pure effect to prevent default behavior of an event
 * @param {Event} event - Event object
 * @returns {Effect} Effect that returns Either<Error, Event>
 */
export const preventDefault = (event) =>
    Effect(() => {
        const validateEvent = (e) =>
            e && typeof e.preventDefault === 'function'
                ? Either.Right(e)
                : Either.Left('Event must have preventDefault method');

        return Either.chain(validEvent => {
            try {
                validEvent.preventDefault();
                return Either.Right(validEvent);
            } catch (error) {
                return Either.Left(`preventDefault failed: ${error.message}`);
            }
        })(validateEvent(event));
    });

/**
 * Pure effect to stop event propagation
 * @param {Event} event - Event object
 * @returns {Effect} Effect that returns Either<Error, Event>
 */
export const stopPropagation = (event) =>
    Effect(() => {
        const validateEvent = (e) =>
            e && typeof e.stopPropagation === 'function'
                ? Either.Right(e)
                : Either.Left('Event must have stopPropagation method');

        return Either.chain(validEvent => {
            try {
                validEvent.stopPropagation();
                return Either.Right(validEvent);
            } catch (error) {
                return Either.Left(`stopPropagation failed: ${error.message}`);
            }
        })(validateEvent(event));
    }); 