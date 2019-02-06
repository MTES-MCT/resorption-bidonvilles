import { getApi, postApi, deleteApi } from '#helpers/api/main';

/**
 * Fetches all towns from the database
 *
 * @returns {Promise}
 */
export function all() {
    return getApi('/towns');
}

/**
 * Fetchs a specific town from the database
 *
 * @param {string} id
 *
 * @returns {Promise}
 */
export function get(id) {
    return getApi(`/towns/${id}`);
}

/**
 * Creates a new town
 *
 * @param {Town_Data} data
 *
 * @returns {Promise}
 */
export function add(data) {
    return postApi('/towns', data);
}

/**
 * Updates a town
 *
 * @param {string}    id
 * @param {Town_Data} data
 *
 * @returns {Promise}
 */
export function edit(id, data) {
    return postApi(`/towns/${id}`, data);
}

/**
 * Deletes a town
 *
 * @param {string} id
 *
 * @returns {Promise}
 */
export function destroy(id) {
    return deleteApi(`/towns/${id}`);
}

/**
 * Adds a comment to a town
 *
 * @param {string}                 id   Town id
 * @param {ShantytownComment_Data} data Comment data
 *
 * @returns {Promise}
 */
export function addComment(id, data) {
    return postApi(`/towns/${id}/steps`, data);
}

/**
 * @typedef {Object} Town_Data
 * @property {number} latitude,
 * @property {number} longitude,
 * @property {string} address,
 * @property {string} detailed_address,
 * @property {?Date} built_at,
 * @property {?number} population_total,
 * @property {?number} population_couples,
 * @property {?number} population_minors,
 * @property {?boolean} access_to_electricity,
 * @property {?boolean} access_to_water,
 * @property {?boolean} trash_evacuation,
 * @property {Array.<number>} social_origins,
 * @property {number} field_type,
 * @property {number} owner_type,
 */

/**
 * @typedef {Object} ShantytownComment_Data
 * @property {string} description
 */
