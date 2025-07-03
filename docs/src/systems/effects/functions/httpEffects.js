// === HTTP Effects ===
// Pure functional HTTP operations using Effect type
// All effects return Either<Error, Success> for proper error handling

import { Effect } from './effect.js';
import Either from '../../../core/types/either.js';
import Maybe from '../../../core/types/maybe.js';

/**
 * Pure effect to make a GET request (synchronous with XMLHttpRequest)
 * @param {string} url - URL to fetch
 * @param {Object} options - Request options
 * @returns {Effect} Effect that returns Either<Error, Response>
 */
export const httpGet = (url, options = {}) =>
    Effect(() => {
        const validateUrl = (urlString) =>
            typeof urlString === 'string' && urlString.trim()
                ? Either.Right(urlString.trim())
                : Either.Left('URL must be a non-empty string');

        const validateOptions = (opts) =>
            opts && typeof opts === 'object'
                ? Either.Right({ ...opts })
                : Either.Right({});

        return Either.chain(validUrl =>
            Either.chain(validOptions => {
                try {
                    const xhr = new XMLHttpRequest();
                    xhr.open('GET', validUrl, false); // Synchronous request
                    
                    // Set headers if provided
                    if (validOptions.headers) {
                        Object.entries(validOptions.headers).forEach(([key, value]) => {
                            xhr.setRequestHeader(key, value);
                        });
                    }
                    
                    xhr.send();
                    
                    if (xhr.status >= 200 && xhr.status < 300) {
                        return Either.Right({
                            status: xhr.status,
                            statusText: xhr.statusText,
                            data: xhr.responseText
                        });
                    } else {
                        return Either.Left(`HTTP Error: ${xhr.status} ${xhr.statusText}`);
                    }
                } catch (error) {
                    return Either.Left(`Request failed: ${error.message}`);
                }
            })(validateOptions(options))
        )(validateUrl(url));
    });

/**
 * Pure effect to make a POST request
 * @param {string} url - URL to post to
 * @param {*} data - Data to send
 * @param {Object} options - Request options
 * @returns {Effect} Effect that returns Either<Error, Response>
 */
export const httpPost = (url, data = null, options = {}) =>
    Effect(() => {
        const validateUrl = (urlString) =>
            typeof urlString === 'string' && urlString.trim()
                ? Either.Right(urlString.trim())
                : Either.Left('URL must be a non-empty string');

        const preparePostOptions = (postData, opts) => {
            const headers = {
                'Content-Type': 'application/json',
                ...opts.headers
            };

            return Either.Right({
                ...opts,
                method: 'POST',
                headers,
                body: postData !== null ? JSON.stringify(postData) : null
            });
        };

        return Either.chain(validUrl =>
            Either.chain(validOptions => {
                try {
                    return fetch(validUrl, validOptions)
                        .then(response => {
                            if (!response.ok) {
                                return Either.Left(`HTTP Error: ${response.status} ${response.statusText}`);
                            }
                            
                            return response.text().then(responseData => Either.Right({
                                status: response.status,
                                statusText: response.statusText,
                                headers: Object.fromEntries(response.headers.entries()),
                                data: responseData
                            }));
                        })
                        .catch(error => Either.Left(`Network Error: ${error.message}`));
                } catch (error) {
                    return Either.Left(`Request failed: ${error.message}`);
                }
            })(preparePostOptions(data, options))
        )(validateUrl(url));
    });

/**
 * Pure effect to make a PUT request
 * @param {string} url - URL to put to
 * @param {*} data - Data to send
 * @param {Object} options - Request options
 * @returns {Effect} Effect that returns Either<Error, Response>
 */
export const httpPut = (url, data = null, options = {}) =>
    Effect(() => {
        const validateUrl = (urlString) =>
            typeof urlString === 'string' && urlString.trim()
                ? Either.Right(urlString.trim())
                : Either.Left('URL must be a non-empty string');

        const preparePutOptions = (putData, opts) => {
            const headers = {
                'Content-Type': 'application/json',
                ...opts.headers
            };

            return Either.Right({
                ...opts,
                method: 'PUT',
                headers,
                body: putData !== null ? JSON.stringify(putData) : null
            });
        };

        return Either.chain(validUrl =>
            Either.chain(validOptions => {
                try {
                    return fetch(validUrl, validOptions)
                        .then(response => {
                            if (!response.ok) {
                                return Either.Left(`HTTP Error: ${response.status} ${response.statusText}`);
                            }
                            
                            return response.text().then(responseData => Either.Right({
                                status: response.status,
                                statusText: response.statusText,
                                headers: Object.fromEntries(response.headers.entries()),
                                data: responseData
                            }));
                        })
                        .catch(error => Either.Left(`Network Error: ${error.message}`));
                } catch (error) {
                    return Either.Left(`Request failed: ${error.message}`);
                }
            })(preparePutOptions(data, options))
        )(validateUrl(url));
    });

/**
 * Pure effect to make a DELETE request
 * @param {string} url - URL to delete
 * @param {Object} options - Request options
 * @returns {Effect} Effect that returns Either<Error, Response>
 */
export const httpDelete = (url, options = {}) =>
    Effect(() => {
        const validateUrl = (urlString) =>
            typeof urlString === 'string' && urlString.trim()
                ? Either.Right(urlString.trim())
                : Either.Left('URL must be a non-empty string');

        const validateOptions = (opts) =>
            opts && typeof opts === 'object'
                ? Either.Right({ ...opts, method: 'DELETE' })
                : Either.Right({ method: 'DELETE' });

        return Either.chain(validUrl =>
            Either.chain(validOptions => {
                try {
                    return fetch(validUrl, validOptions)
                        .then(response => {
                            if (!response.ok) {
                                return Either.Left(`HTTP Error: ${response.status} ${response.statusText}`);
                            }
                            
                            return response.text().then(data => Either.Right({
                                status: response.status,
                                statusText: response.statusText,
                                headers: Object.fromEntries(response.headers.entries()),
                                data: data
                            }));
                        })
                        .catch(error => Either.Left(`Network Error: ${error.message}`));
                } catch (error) {
                    return Either.Left(`Request failed: ${error.message}`);
                }
            })(validateOptions(options))
        )(validateUrl(url));
    }); 