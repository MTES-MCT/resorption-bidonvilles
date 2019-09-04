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
 * @param {String} permission
 *
 * @returns {Permission}
 */
export function getPermission(permissionName) {
    if (configuration === null || configuration.user === null) {
        return null;
    }

    const [entity, feature] = permissionName.split('.');
    if (!Object.prototype.hasOwnProperty.call(configuration.user.permissions, entity)
        || !Object.prototype.hasOwnProperty.call(configuration.user.permissions[entity], feature)) {
        return null;
    }

    const permission = configuration.user.permissions[entity][feature];
    if (permission.allowed !== true) {
        return null;
    }

    return permission;
}

/**
 * Checks if the current user has a specific permission
 *
 * @param {String} permission
 *
 * @returns {boolean}
 */
export function hasPermission(permissionName) {
    const [entity, feature, data] = permissionName.split('.');
    const permission = getPermission(`${entity}.${feature}`);

    return permission !== null && (data === undefined || permission[data] === true);
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
