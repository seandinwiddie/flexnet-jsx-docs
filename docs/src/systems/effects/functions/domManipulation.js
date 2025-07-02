// === DOM Manipulation Effects ===
// Pure functional DOM manipulation using Effect type

import { Effect } from './effect.js';
import Either from '../../../core/types/either.js';

export const setHTML = (element, html) =>
    Effect.of(() => {
        if (!element) return Either.Left('Element is null');
        element.innerHTML = html;
        return Either.Right(element);
    });

export const setText = (element, text) =>
    Effect.of(() => {
        if (!element) return Either.Left('Element is null');
        element.textContent = text;
        return Either.Right(element);
    });

export const addClass = (element, className) =>
    Effect.of(() => {
        if (!element) return Either.Left('Element is null');
        element.classList.add(className);
        return Either.Right(element);
    });

export const removeClass = (element, className) =>
    Effect.of(() => {
        if (!element) return Either.Left('Element is null');
        element.classList.remove(className);
        return Either.Right(element);
    });

export const hasClass = (element, className) =>
    Effect.of(() => {
        if (!element) return Either.Left('Element is null');
        return Either.Right(element.classList.contains(className));
    });

export const setAttribute = (element, name, value) =>
    Effect.of(() => {
        if (!element) return Either.Left('Element is null');
        element.setAttribute(name, value);
        return Either.Right(element);
    });

export const setStyle = (element, property, value) =>
    Effect.of(() => {
        if (!element) return Either.Left('Element is null');
        element.style[property] = value;
        return Either.Right(element);
    }); 