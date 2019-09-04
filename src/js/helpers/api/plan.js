import { getApi, postApi, deleteApi } from '#helpers/api/main';

/**
 * Lists all existing plans
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

/**
 * Updates a plan's details
 *
 * @param {number|null} detailsId
 * @param {Object}      data
 *
 * @returns {Promise}
 */
export function update(detailsId, data) {
    return postApi(`/plan-details/${detailsId}`, data);
}

/**
 * Links  a nw town to an existing  plan
 *
 * @param {number} planId
 * @param {number} townId
 *
 * @returns {Promise}
 */
export function link(planId, townId) {
    return postApi(`/plans/${planId}/towns`, {
        townId,
    });
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
