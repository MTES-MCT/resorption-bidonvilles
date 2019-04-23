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
