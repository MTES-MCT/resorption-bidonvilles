import { getApi } from "#helpers/api/main";

/**
 * Fetches any location
 *
 * @param {String} type
 * @param {String} [code]
 *
 * @returns {Promise}
 */
export function get(type, code) {
    return getApi(`/locations/${type}${code ? `/${code}` : ""}`);
}

/**
 * Lists all departements related to a specific region
 *
 * @returns {Promise}
 */
export function getDepartementsForRegion(regionCode) {
    return getApi(`/regions/${regionCode}/departements`);
}

export function getDepartements() {
    return getApi("/departements");
}

/**
 * Lists all departements related to a specific epci
 *
 * @returns {Promise}
 */
export function getDepartementsForEpci(epciCode) {
    return getApi(`/epci/${epciCode}/departements`);
}
