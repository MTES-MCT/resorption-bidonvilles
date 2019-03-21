import { getApi } from '#helpers/api/main';
import { refreshToken } from '#helpers/api/user';

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
 * Loads the configuration for the current user
 *
 * If there is no user currently logged in, this request will fail.
 *
 * @returns {Promise}
 */
export function load() {
    return getApi('/config').then((response) => {
        // refresh the token, by the way
        refreshToken();

        configuration = response;
        return response;
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
 * Checks if the current user has a specific permission
 *
 * @param {Permission} permission
 *
 * @returns {boolean}
 */
export function hasPermission({ name, type }) {
    if (configuration === null || configuration.user === null) {
        return false;
    }

    return configuration.user.permissions[type] && configuration.user.permissions[type].indexOf(name) !== -1;
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
