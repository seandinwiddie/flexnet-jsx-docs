// === Utility Effects ===
// Common utility operations using Effect type

import { Effect } from './effect.js';
import Either from '../../../core/types/either.js';
import Maybe from '../../../core/types/maybe.js';
import { httpGet } from './httpEffects.js';
import { setHTML } from './domManipulation.js';
import { query } from './domQuery.js';
import { executeEffect } from './executeEffect.js';
import Result from '../../../core/types/result.js';

export const fetchResource = (url) =>
    httpGet(url);

export const safeSetHTML = (html) => (element) =>
    setHTML(element, html);

export const loadComponent = (elementId, url) =>
    async () => {
        const htmlResult = await executeEffect(httpGet(url));

        return htmlResult.fold(
            error => Result.Error(`Failed to load component from ${url}: ${error}`),
            async (html) => {
                const elementResult = await executeEffect(query(`#${elementId}`));
                
                return Maybe.fold(
                    () => Result.Error(`Element with id '${elementId}' not found.`),
                    async (element) => {
                        await executeEffect(setHTML(element, html));
                        return Result.Ok(element);
                    }
                )(elementResult);
            }
        );
    }; 