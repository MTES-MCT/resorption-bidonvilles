import { isLoggedIn } from '#helpers/userHelper';

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
    return new Promise((success, failure) => {
        setTimeout(() => {
            if (isLoggedIn() === false) {
                failure();
            }

            configuration = Object.freeze({
                user: {
                    email: localStorage.getItem('auth_token'),
                    map_center: [43.3050621, 0.684586],
                },
                field_types: [
                    { field_type_id: -1, name: 'Inconnu' },
                    { field_type_id: 1, name: 'Terrain' },
                    { field_type_id: 2, name: 'Immeuble bâti' },
                ],
                owner_types: [
                    { owner_type_id: -1, name: 'Inconnu' },
                    { owner_type_id: 1, name: 'Public' },
                    { owner_type_id: 2, name: 'Privé' },
                ],
                social_origins: [
                    { social_origins_id: 1, name: 'Ressortissants Français' },
                    { social_origins_id: 2, name: 'Ressortissants de l\'Union Européenne' },
                    { social_origins_id: 3, name: 'Ressortissants extracommunautaires' },
                ],
            });

            success(configuration);
        }, 10);
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
