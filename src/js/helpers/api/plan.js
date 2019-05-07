import { getApi, postApi } from '#helpers/api/main';

/**
 * Lists all existing plans
 *
 * @param {Object} data
 *
 * @returns {Promise}
 */
export function list() {
    return getApi('/plans');
}

/**
 * Fetchs a specific plan from the database
 *
 * @param {string} id
 *
 * @returns {Promise}
 */
export function get(id) {
    return getApi(`/plans/${id}`);
}

/**
 * Creates a new plan
 *
 * @param {Object} data
 *
 * @returns {Promise}
 */
export function create(data) {
    return postApi('/plans', data);
}

export default create;
