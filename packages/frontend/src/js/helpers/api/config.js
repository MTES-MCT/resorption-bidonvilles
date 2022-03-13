import { getApi, postApi } from "#helpers/api/main";

/**
 * Loads the configuration for the current user
 *
 * If there is no user currently logged in, this request will fail.
 *
 * @returns {Promise}
 */
export function load() {
    return getApi("/config");
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
