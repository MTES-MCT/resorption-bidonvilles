import { getApi } from "#src/js/api";

/**
 * Lists all statistics
 *
 * @returns {Promise}
 */
export function all(departement) {
    return getApi(`/stats/${departement ? `${departement}` : ""}`);
}

/**
 * GET /statistics/export
 */
export function exportStats() {
    return getApi("/statistics/export");
}

export default all;
