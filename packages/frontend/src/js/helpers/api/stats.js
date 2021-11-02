import { getApi } from "#helpers/api/main";

/**
 * Lists all statistics
 *
 * @returns {Promise}
 */
export function all(departement) {
    return getApi(`/stats/${departement ? `${departement}` : ""}`);
}

/**
 * GET /users/export
 */
export function exportStats() {
    return getApi("/statistics/export");
}

export default all;
