import { postApi, getApi, patchApi } from "#helpers/api/main";

/**
 * Lists all existing plans
 *
 * @returns {Promise}
 */
export function list() {
    return getApi("/plans");
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
    return postApi("/plans", data);
}

/**
 * Updates a plan
 *
 * @param {Object} data
 *
 * @returns {Promise}
 */
export async function update(id, data) {
    return postApi(`/plans/${id}`, data);
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

/**
 * Adds a comment to a plan
 *
 * @param {string}                 id   Plan id
 * @param {PlanComment_Data} data Comment data
 *
 * @returns {Promise}
 */
export function addComment(id, data) {
    return postApi(`/plans/${id}/comments`, data);
}

/**
 *
 */
export async function close(planId, data) {
    return patchApi(`/plans/${planId}`, {
        operation: "close",
        data
    });
}

/**
 *
 */
export function exportPlans() {
    return getApi("/plans/export");
}
