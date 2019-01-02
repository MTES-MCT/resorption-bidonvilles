import { getToken, logout } from '#helpers/api/user';
import { router } from '#app/router';

/**
 * Generic error codes
 *
 * @readonly
 * @enum {number}
 */
const ERRORS = {
    MISSING_TOKEN: 1,
    EXPIRED_OR_INVALID_TOKEN: 2,
};

/**
 * Handles a response from the API
 *
 * @param {Function} success Success callback
 * @param {Function} failure Failure callback
 */
function handleRequestResponse(success, failure) {
    let response = null;
    try {
        response = JSON.parse(this.responseText);
    } catch (error) {
        failure({
            user_message: 'Une erreur inconnue est survenue',
            developer_message: 'Failed to parsed the server\'s response',
        });
        return;
    }

    if (this.status !== 200) {
        switch (response && response.error && response.error.code) {
        // handle generic errors
        case ERRORS.MISSING_TOKEN:
        case ERRORS.EXPIRED_OR_INVALID_TOKEN:
            logout();
            router.push('/');
            break;

        // for everything else, let the current component decide what's best
        default:
            failure((response && response.error) || {
                user_message: 'Une erreur inconnue est survenue',
                developer_message: 'The server responded with an error status but did not provide error details',
            });
        }

        return;
    }

    success(response);
}

/**
 * Handles a failure of the request
 *
 * This is different from the API responding with an error.
 * This function handles failures in reaching the API server like timeouts
 * or internal server errors preventing the API from actually providing
 * us with a response.
 *
 * @param {Function} callback
 */
function handleRequestFailure(callback) {
    callback();
}

/**
 * Sends an API request
 *
 * @param {string}                 method
 * @param {string}                 url
 * @param {Object}                 [data]
 * @param {Object.<string,string>} [headers]
 *
 * @returns {Promise}
 */
function request(method, url, data, headers = {}) {
    return new Promise((success, failure) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, `${process.env.API_URL}${url}`);

        Object.keys(headers).forEach((name) => {
            xhr.setRequestHeader(name, headers[name]);
        });

        if (!Object.prototype.hasOwnProperty.call(headers, 'x-access-token')) {
            const token = getToken();
            if (token !== null) {
                xhr.setRequestHeader('x-access-token', token);
            }
        }

        xhr.onload = handleRequestResponse.bind(xhr, success, failure);
        xhr.onerror = handleRequestFailure.bind(xhr, failure);
        xhr.ontimeout = handleRequestFailure.bind(xhr, failure);

        if (data !== undefined) {
            if (!Object.prototype.hasOwnProperty.call(headers, 'Content-Type')) {
                xhr.setRequestHeader('Content-Type', 'application/json');
            }

            xhr.send(JSON.stringify(data));
        } else {
            xhr.send();
        }
    });
}

/**
 * Alias for GET requests
 *
 * @param {string}                 url
 * @param {Object}                 [data]
 * @param {Object.<string,string>} [headers]
 *
 * @returns {Promise}
 */
export function getApi(url, data, headers) {
    return request('GET', url, data, headers);
}

/**
 * Alias for POST requests
 *
 * @param {string}                 url
 * @param {Object}                 [data]
 * @param {Object.<string,string>} [headers]
 *
 * @returns {Promise}
 */
export function postApi(url, data, headers) {
    return request('POST', url, data, headers);
}
