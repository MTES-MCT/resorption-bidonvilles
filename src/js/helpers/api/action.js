import { getApi, postApi } from '#helpers/api/main';

/**
 * Fetches all actions from the database
 *
 * @returns {Promise}
 */
export function all() {
    return getApi('/actions');
}

/**
 * Fetchs a specific action from the database
 *
 * @param {string} id
 *
 * @returns {Promise}
 */
export function get(id) {
    return getApi(`/actions/${id}`);
}

/**
 * Creates a new action
 *
 * @param {Action_Data} data
 *
 * @returns {Promise}
 */
export function add(data) {
    return postApi('/actions', data);
}

/**
 * Creates a new action step
 *
 * @param {string} id
 * @param {ActionStep_Data} data
 *
 * @returns {Promise}
 */
export function addStep(id, data) {
    return postApi(`/actions/${id}/steps`, data);
}

/**
 * @typedef {Object} Action_Data
 * @property {number} type
 * @property {string} description
 * @property {?Date}  started_at
 * @property {string} territory_type
 * @property {string} territory_code
 */

/**
 * @typedef {Object} ActionStep_Data
 * @property {string} description
 */
