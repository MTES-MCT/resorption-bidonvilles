import { getApi, postApi } from "#helpers/api/main";
import { refreshToken } from "#helpers/api/user";

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
    return getApi("/config").then(response => {
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
 * Updates the local configuration
 *
 * @param {String} property A chain of properties (example: user.first_name)
 * @param {Object} value    The new value for the property
 *
 * @returns {undefined}
 */
export function set(property, value) {
    if (configuration === null) {
        return;
    }

    const chain = property.split(".");
    let ref = configuration;

    while (chain.length > 1) {
        if (ref === undefined) {
            return;
        }

        ref = ref[chain.shift()];
    }

    ref[chain[0]] = value;
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

    const [entity, feature] = permissionName.split(".");
    if (
        !Object.prototype.hasOwnProperty.call(
            configuration.user.permissions,
            entity
        ) ||
        !Object.prototype.hasOwnProperty.call(
            configuration.user.permissions[entity],
            feature
        )
    ) {
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
    const [entity, feature, data] = permissionName.split(".");
    const permission = getPermission(`${entity}.${feature}`);

    return (
        permission !== null && (data === undefined || permission[data] === true)
    );
}

/**
 * Marks a changelog as read
 *
 * @param {Number} version The latest version read by the user
 *
 * @returns {Promise}
 */
export function closeChangelog(version) {
    return postApi("/changelog", { version });
}

/**
 * Indicates whether the current user has accepted the charte
 *
 * @returns {Boolean}
 */
export function hasAcceptedCharte() {
    if (configuration === null) {
        return false;
    }

    return configuration.user.charte_engagement_a_jour;
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
