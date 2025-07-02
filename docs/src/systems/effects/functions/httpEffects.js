// === HTTP Effects ===
// Pure functional HTTP requests using Effect type

import { Effect } from './effect.js';
import Either from '../../../core/types/either.js';

const makeRequest = (url, options) =>
    Effect.of(async () => {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                return Either.Left(`HTTP ${response.status}: ${response.statusText}`);
            }
            const data = await response.text();
            return Either.Right(data);
        } catch (error) {
            return Either.Left(`Network error: ${error.message}`);
        }
    });

export const httpGet = (url) =>
    makeRequest(url, { method: 'GET' });

export const httpPost = (url, data) =>
    makeRequest(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

export const httpPut = (url, data) =>
    makeRequest(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

export const httpDelete = (url) =>
    makeRequest(url, { method: 'DELETE' }); 