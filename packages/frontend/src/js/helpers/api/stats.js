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
 * GET /statistics/export
 */
export function exportStats() {
    return getApi("/statistics/export");
}

/**
 * GET /statistics/wau
 */
export function wau() {
    return getApi("/statistics/wau");
}

export default all;
