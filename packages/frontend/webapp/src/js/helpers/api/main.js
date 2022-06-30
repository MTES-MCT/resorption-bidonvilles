import Vue from "vue";
import store from "#app/store/index";
import { open as openTab } from "#helpers/tabHelper";
import { VUE_APP_API_URL, APP_VERSION } from "#src/js/env.js";

/**
 * Generic error codes
 *
 * @readonly
 * @enum {number}
 */
const ERRORS = {
    MISSING_TOKEN: 1,
    EXPIRED_OR_INVALID_TOKEN: 2
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
        response = this.responseText
            ? JSON.parse(this.responseText)
            : this.responseText;
    } catch (error) {
        failure({
            user_message: "Une erreur inconnue est survenue"
        });
        return;
    }

    if (response.success === true && response.response !== undefined) {
        success(response.response);
        return;
    }

    if (this.status / 200 < 1 || this.status / 200 >= 1.5) {
        const errorObject = (response && response.error) || response || {};
        switch (errorObject.code) {
            // handle generic errors
            case ERRORS.MISSING_TOKEN:
            case ERRORS.EXPIRED_OR_INVALID_TOKEN:
                {
                    store.commit("user/SET_ACCESS_TOKEN", null);
                    {
                        const piwik = Vue.prototype.$piwik;
                        if (piwik) {
                            piwik.resetUserId();
                            piwik.setCustomVariable(1, "user", null);
                            piwik.setCustomVariable(
                                5,
                                "departement_code",
                                null
                            );
                        }
                    }

                    store.commit("setEntrypoint", window.location.pathname);
                    window.dispatchEvent(
                        new CustomEvent("callRouter", {
                            detail: {
                                routerMethod: "push",
                                routerArgs: ["/connexion?r=1"]
                            }
                        })
                    );
                }
                break;

            // for everything else, let the current component decide what's best
            default:
                failure(
                    errorObject.user_message
                        ? errorObject
                        : {
                              user_message: "Une erreur inconnue est survenue"
                          }
                );
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
    const xhr = new XMLHttpRequest();
    const promise = new Promise((success, failure) => {
        xhr.open(method, `${VUE_APP_API_URL}${url}`);

        Object.keys(headers).forEach(name => {
            xhr.setRequestHeader(name, headers[name]);
        });

        if (!Object.prototype.hasOwnProperty.call(headers, "x-access-token")) {
            const token = store.state.user.accessToken;
            if (token !== null) {
                xhr.setRequestHeader("x-access-token", token);
            }
        }

        xhr.setRequestHeader("x-app-version", APP_VERSION);

        xhr.onload = handleRequestResponse.bind(xhr, success, failure);
        xhr.onerror = handleRequestFailure.bind(xhr, failure);
        xhr.ontimeout = handleRequestFailure.bind(xhr, failure);
        if (data !== undefined) {
            if (
                !Object.prototype.hasOwnProperty.call(headers, "Content-Type")
            ) {
                xhr.setRequestHeader("Content-Type", "application/json");
            }
            xhr.send(JSON.stringify(data));
        } else {
            xhr.send();
        }
    });
    promise.abort = () => {
        xhr.abort();
    };

    return promise;
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
    return request("GET", url, data, headers);
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
    return request("POST", url, data, headers);
}

/**
 * Alias for DELETE requests
 *
 * @param {string}                 url
 * @param {Object}                 [data]
 * @param {Object.<string,string>} [headers]
 *
 * @returns {Promise}
 */
export function deleteApi(url, data, headers) {
    return request("DELETE", url, data, headers);
}

/**
 * Alias for PATCH requests
 *
 * @param {string}                 url
 * @param {Object}                 [data]
 * @param {Object.<string,string>} [headers]
 *
 * @returns {Promise}
 */
export function patchApi(url, data, headers) {
    return request("PATCH", url, data, headers);
}

/**
 * Alias for PUT requests
 *
 * @param {string}                 url
 * @param {Object}                 [data]
 * @param {Object.<string,string>} [headers]
 *
 * @returns {Promise}
 */
export function putApi(url, data, headers) {
    return request("PUT", url, data, headers);
}

/**
 * Opens a new tab with the given URL
 *
 * Appends the access token to the request
 *
 * @param {String} url
 */
export function open(url) {
    const token = store.state.user.accessToken;
    return openTab(
        `${url}${
            url.indexOf("?") === -1 ? "?" : "&"
        }accessToken=${encodeURIComponent(token)}`
    );
}
