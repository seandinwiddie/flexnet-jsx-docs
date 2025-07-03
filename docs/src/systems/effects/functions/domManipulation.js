// === DOM Manipulation Effects ===
// Pure functional DOM manipulation using Effect type
// All effects return Either<Error, Success> for proper error handling

import { Effect } from './effect.js';
import Either from '../../../core/types/either.js';
import Maybe from '../../../core/types/maybe.js';

/**
 * Pure effect to set HTML content of an element
 * @param {Element} element - Target DOM element
 * @param {string} html - HTML content to set
 * @returns {Effect} Effect that returns Either<Error, Element>
 */
export const setHTML = (element, html) =>
    Effect(() => 
        Maybe.fromNullable(element)
            .fold(
                () => Either.Left('Element is null or undefined'),
                (el) => {
                    try {
                        el.innerHTML = String(html || '');
                        return Either.Right(el);
                    } catch (error) {
                        return Either.Left(`Failed to set HTML: ${error.message}`);
                    }
                }
            )
    );

/**
 * Pure effect to set text content of an element
 * @param {Element} element - Target DOM element  
 * @param {string} text - Text content to set
 * @returns {Effect} Effect that returns Either<Error, Element>
 */
export const setText = (element, text) =>
    Effect(() =>
        Maybe.fromNullable(element)
            .fold(
                () => Either.Left('Element is null or undefined'),
                (el) => {
                    try {
                        el.textContent = String(text || '');
                        return Either.Right(el);
                    } catch (error) {
                        return Either.Left(`Failed to set text: ${error.message}`);
                    }
                }
            )
    );

/**
 * Pure effect to add a CSS class to an element
 * @param {Element} element - Target DOM element
 * @param {string} className - CSS class name to add
 * @returns {Effect} Effect that returns Either<Error, Element>
 */
export const addClass = (element, className) =>
    Effect(() =>
        Maybe.fromNullable(element)
            .fold(
                () => Either.Left('Element is null or undefined'),
                (el) => {
                    try {
                        if (typeof className === 'string' && className.trim()) {
                            el.classList.add(className.trim());
                            return Either.Right(el);
                        }
                        return Either.Left('Invalid class name: must be non-empty string');
                    } catch (error) {
                        return Either.Left(`Failed to add class: ${error.message}`);
                    }
                }
            )
    );

/**
 * Pure effect to remove a CSS class from an element
 * @param {Element} element - Target DOM element
 * @param {string} className - CSS class name to remove
 * @returns {Effect} Effect that returns Either<Error, Element>
 */
export const removeClass = (element, className) =>
    Effect(() =>
        Maybe.fromNullable(element)
            .fold(
                () => Either.Left('Element is null or undefined'),
                (el) => {
                    try {
                        if (typeof className === 'string' && className.trim()) {
                            el.classList.remove(className.trim());
                            return Either.Right(el);
                        }
                        return Either.Left('Invalid class name: must be non-empty string');
                    } catch (error) {
                        return Either.Left(`Failed to remove class: ${error.message}`);
                    }
                }
            )
    );

/**
 * Pure effect to check if an element has a CSS class
 * @param {Element} element - Target DOM element
 * @param {string} className - CSS class name to check
 * @returns {Effect} Effect that returns Either<Error, boolean>
 */
export const hasClass = (element, className) =>
    Effect(() =>
        Maybe.fromNullable(element)
            .fold(
                () => Either.Left('Element is null or undefined'),
                (el) => {
                    try {
                        if (typeof className === 'string' && className.trim()) {
                            const hasClassResult = el.classList.contains(className.trim());
                            return Either.Right(hasClassResult);
                        }
                        return Either.Left('Invalid class name: must be non-empty string');
                    } catch (error) {
                        return Either.Left(`Failed to check class: ${error.message}`);
                    }
                }
            )
    );

/**
 * Pure effect to set an attribute on an element
 * @param {Element} element - Target DOM element
 * @param {string} name - Attribute name
 * @param {string} value - Attribute value
 * @returns {Effect} Effect that returns Either<Error, Element>
 */
export const setAttribute = (element, name, value) =>
    Effect(() =>
        Maybe.fromNullable(element)
            .fold(
                () => Either.Left('Element is null or undefined'),
                (el) => {
                    try {
                        if (typeof name === 'string' && name.trim()) {
                            el.setAttribute(name.trim(), String(value || ''));
                            return Either.Right(el);
                        }
                        return Either.Left('Invalid attribute name: must be non-empty string');
                    } catch (error) {
                        return Either.Left(`Failed to set attribute: ${error.message}`);
                    }
                }
            )
    );

/**
 * Pure effect to get an attribute from an element
 * @param {Element} element - Target DOM element
 * @param {string} name - Attribute name
 * @returns {Effect} Effect that returns Either<Error, Maybe<string>>
 */
export const getAttribute = (element, name) =>
    Effect(() =>
        Maybe.fromNullable(element)
            .fold(
                () => Either.Left('Element is null or undefined'),
                (el) => {
                    try {
                        if (typeof name === 'string' && name.trim()) {
                            const attributeValue = el.getAttribute(name.trim());
                            return Either.Right(Maybe.fromNullable(attributeValue));
                        }
                        return Either.Left('Invalid attribute name: must be non-empty string');
                    } catch (error) {
                        return Either.Left(`Failed to get attribute: ${error.message}`);
                    }
                }
            )
    );

/**
 * Pure effect to set a CSS style property on an element
 * @param {Element} element - Target DOM element
 * @param {string} property - CSS property name
 * @param {string} value - CSS property value
 * @returns {Effect} Effect that returns Either<Error, Element>
 */
export const setStyle = (element, property, value) =>
    Effect(() =>
        Maybe.fromNullable(element)
            .fold(
                () => Either.Left('Element is null or undefined'),
                (el) => {
                    try {
                        if (typeof property === 'string' && property.trim()) {
                            el.style[property.trim()] = String(value || '');
                            return Either.Right(el);
                        }
                        return Either.Left('Invalid style property: must be non-empty string');
                    } catch (error) {
                        return Either.Left(`Failed to set style: ${error.message}`);
                    }
                }
            )
    ); 