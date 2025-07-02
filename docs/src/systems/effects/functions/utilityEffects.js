// === Utility Effects ===
// Common utility operations using Effect type

import { Effect } from './effect.js';
import Either from '../../../core/types/either.js';
import Maybe from '../../../core/types/maybe.js';
import { httpGet } from './httpEffects.js';
import { setHTML } from './domManipulation.js';
import { query } from './domQuery.js';

export const fetchResource = (url) =>
    httpGet(url);

export const safeSetHTML = (html) => (element) =>
    setHTML(element, html);

export const loadComponent = (placeholderId, componentUrl) =>
    Effect.of(async () => {
        try {
            // Query for the placeholder element
            const queryResult = Effect.run(query(`#${placeholderId}`));
            const placeholder = queryResult.getOrElse(null);
            
            if (!placeholder) {
                return Either.Left(`Placeholder element '${placeholderId}' not found`);
            }
            
            // Fetch the component
            const fetchResult = await Effect.run(fetchResource(componentUrl));
            
            return fetchResult.fold(
                error => Either.Left(`Failed to load component: ${error}`),
                async (html) => {
                    // Set the HTML content
                    const setResult = Effect.run(setHTML(placeholder, html));
                    return setResult.fold(
                        error => Either.Left(`Failed to render component: ${error}`),
                        () => Either.Right(`Component '${placeholderId}' loaded successfully`)
                    );
                }
            );
        } catch (error) {
            return Either.Left(`Component loading error: ${error.message}`);
        }
    }); 