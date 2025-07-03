// === DOM Query Effects ===
// Pure functional DOM querying using Effect type
// All effects return Either<Error, Success> for proper error handling

import { Effect } from './effect.js';
import Either from '../../../core/types/either.js';
import Maybe from '../../../core/types/maybe.js';

/**
 * Pure effect to query a single DOM element
 * @param {string} selector - CSS selector string
 * @returns {Effect} Effect that returns Either<Error, Maybe<Element>>
 */
export const query = (selector) =>
    Effect(() => {
        if (typeof selector !== 'string' || !selector.trim()) {
            return Either.Left('Invalid selector: must be non-empty string');
        }
        
        try {
            const element = document.querySelector(selector.trim());
            return Either.Right(Maybe.fromNullable(element));
        } catch (error) {
            return Either.Left(`Query failed for selector "${selector}": ${error.message}`);
        }
    });

/**
 * Pure effect to query multiple DOM elements
 * @param {string} selector - CSS selector string
 * @returns {Effect} Effect that returns Either<Error, Array<Element>>
 */
export const queryAll = (selector) =>
    Effect(() => {
        if (typeof selector !== 'string' || !selector.trim()) {
            return Either.Left('Invalid selector: must be non-empty string');
        }
        
        try {
            const elements = document.querySelectorAll(selector.trim());
            const elementArray = Array.from(elements);
            return Either.Right(elementArray);
        } catch (error) {
            return Either.Left(`QueryAll failed for selector "${selector}": ${error.message}`);
        }
    });

/**
 * Pure effect to query an element by ID
 * @param {string} id - Element ID
 * @returns {Effect} Effect that returns Either<Error, Maybe<Element>>
 */
export const queryById = (id) =>
    Effect(() => {
        if (typeof id !== 'string' || !id.trim()) {
            return Either.Left('Invalid ID: must be non-empty string');
        }
        
        try {
            const element = document.getElementById(id.trim());
            return Either.Right(Maybe.fromNullable(element));
        } catch (error) {
            return Either.Left(`QueryById failed for ID "${id}": ${error.message}`);
        }
    });

/**
 * Pure effect to query elements by class name
 * @param {string} className - CSS class name
 * @returns {Effect} Effect that returns Either<Error, Array<Element>>
 */
export const queryByClassName = (className) =>
    Effect(() => {
        if (typeof className !== 'string' || !className.trim()) {
            return Either.Left('Invalid class name: must be non-empty string');
        }
        
        try {
            const elements = document.getElementsByClassName(className.trim());
            const elementArray = Array.from(elements);
            return Either.Right(elementArray);
        } catch (error) {
            return Either.Left(`QueryByClassName failed for class "${className}": ${error.message}`);
        }
    });

/**
 * Pure effect to query elements by tag name
 * @param {string} tagName - HTML tag name
 * @returns {Effect} Effect that returns Either<Error, Array<Element>>
 */
export const queryByTagName = (tagName) =>
    Effect(() => {
        if (typeof tagName !== 'string' || !tagName.trim()) {
            return Either.Left('Invalid tag name: must be non-empty string');
        }
        
        try {
            const elements = document.getElementsByTagName(tagName.trim());
            const elementArray = Array.from(elements);
            return Either.Right(elementArray);
        } catch (error) {
            return Either.Left(`QueryByTagName failed for tag "${tagName}": ${error.message}`);
        }
    });

/**
 * Pure effect to find the closest ancestor element matching a selector
 * @param {Element} element - Starting element
 * @param {string} selector - CSS selector string
 * @returns {Effect} Effect that returns Either<Error, Maybe<Element>>
 */
export const queryClosest = (element, selector) =>
    Effect(() => {
        if (!element) {
            return Either.Left('Element is null or undefined');
        }
        
        if (typeof selector !== 'string' || !selector.trim()) {
            return Either.Left('Invalid selector: must be non-empty string');
        }
        
        try {
            const closestElement = element.closest(selector.trim());
            return Either.Right(Maybe.fromNullable(closestElement));
        } catch (error) {
            return Either.Left(`QueryClosest failed for selector "${selector}": ${error.message}`);
        }
    });

/**
 * Pure effect to check if an element matches a selector
 * @param {Element} element - Element to test
 * @param {string} selector - CSS selector string
 * @returns {Effect} Effect that returns Either<Error, boolean>
 */
export const matches = (element, selector) =>
    Effect(() => {
        if (!element) {
            return Either.Left('Element is null or undefined');
        }
        
        if (typeof selector !== 'string' || !selector.trim()) {
            return Either.Left('Invalid selector: must be non-empty string');
        }
        
        try {
            const matchesResult = element.matches(selector.trim());
            return Either.Right(matchesResult);
        } catch (error) {
            return Either.Left(`Matches failed for selector "${selector}": ${error.message}`);
        }
    }); 