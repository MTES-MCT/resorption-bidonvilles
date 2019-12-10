import { postApi, getApi } from '#helpers/api/main';

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
export async function get(id) {
    return getApi(`/plans/${id}`);
}

/**
 * Creates a new plan
 *
 * @param {Object} data
 *
 * @returns {Promise}
 */
export async function create(data) {
    return postApi('/plans', data);
}

/**
 * Updates a plan's details
 *
 * @param {number} planId
 * @param {Object} data
 *
 * @returns {Promise}
 */
export async function addState(planId, data) {
    return postApi(`/plans/${planId}/states`, data);
}
