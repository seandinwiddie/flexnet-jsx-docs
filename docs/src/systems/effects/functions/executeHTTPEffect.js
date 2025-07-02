import Either from '../../../core/types/either.js';
import { sanitizeURL } from '../../../security/xss.js';

export const executeHTTPEffect = async (effect) => {
    const { operation, payload } = effect;

    const sanitizedUrl = sanitizeURL(payload.url);
    if (sanitizedUrl.type === 'Left') {
        return Either.Left(`Invalid URL: ${sanitizedUrl.value}`);
    }

    const defaultOptions = {
        headers: { 'Content-Type': 'application/json' },
        ...payload.options
    };

    try {
        let response;
        switch (operation) {
            case 'get':
                response = await fetch(payload.url, { ...defaultOptions, method: 'GET' });
                break;
            case 'post':
                response = await fetch(payload.url, {
                    ...defaultOptions,
                    method: 'POST',
                    body: typeof payload.body === 'string' ? payload.body : JSON.stringify(payload.body)
                });
                break;
            case 'put':
                response = await fetch(payload.url, {
                    ...defaultOptions,
                    method: 'PUT',
                    body: typeof payload.body === 'string' ? payload.body : JSON.stringify(payload.body)
                });
                break;
            case 'delete':
                response = await fetch(payload.url, { ...defaultOptions, method: 'DELETE' });
                break;
            default:
                return Either.Left(`Unknown HTTP operation: ${operation}`);
        }

        const data = await response.text();
        return Either.Right({
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries()),
            data
        });
    } catch (error) {
        return Either.Left(error.message || 'HTTP request failed');
    }
}; 