import { getApi, postApi, deleteApi } from '#helpers/api/main';

/**
 * Lists all existing plans
 *
 * @param {string} [departement]
 *
 * @returns {Promise}
 */
export function list(departement) {
    return getApi(`/plans${departement ? `?departement=${encodeURIComponent(departement)}` : ''}`);
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

/**
 * Deletes a plan
 *
 * @param {string} id
 *
 * @returns {Promise}
 */
export function destroy(id) {
    return deleteApi(`/plans/${id}`);
}
