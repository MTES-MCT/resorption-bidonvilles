/**
 * Loaded configuration
 *
 * @type {Configuration|null}
 */
let configuration = null;

/**
 * Checks if the configuration for the current user is loaded
 *
 * The configuration consists in:
 * - data specific to the current user (email, name, etc., this kind of stuff)
 * - static data that can be reused all over the app (list of town's field types, owner types, and so on)
 *
 * The reason behind loading the static data is to avoid fetching it each time a component needs it,
 * which we can assume will be VERY OFTEN.
 * It makes us save a few useless HTTP requests in the future.
 *
 * @returns {boolean}
 */
export function isLoaded() {
    return configuration !== null;
}

/**
 * Handles the response from the API
 *
 * @param {Function} success
 * @param {Function} failure
 */
function onLoad(success, failure) {
    let response = null;
    try {
        response = JSON.parse(this.responseText);
    } catch (error) {
        failure({
            user_message: 'Erreur inconnue',
        });
        return;
    }

    if (this.status !== 200) {
        failure((response && response.error) || {
            user_message: 'Erreur inconnue',
        });
        return;
    }

    configuration = response;
    success(response);
}

/**
 * Loads the configuration for the current user
 *
 * If there is no user currently logged in, this request will fail.
 *
 * @returns {Promise}
 */
export function load() {
    return new Promise((success, failure) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://localhost:5000/config');
        xhr.onload = onLoad.bind(xhr, success, failure);
        xhr.send();
    });
}

/**
 * Unloads the current configuration
 *
 * Should be used whenever the current user logs out
 */
export function unload() {
    configuration = null;
}

/**
 * Returns the current configuration
 *
 * @returns {Configuration|null}
 */
export function get() {
    return configuration;
}

/**
 * @typedef {Object} Configuration
 * @property {UserConfiguration} user
 * @property {Array}             field_types
 */

/**
 * @typedef {Object} UserConfiguration
 * @property {string} email
 */
