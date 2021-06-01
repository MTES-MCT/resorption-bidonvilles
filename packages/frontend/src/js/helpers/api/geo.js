import { getApi } from "#helpers/api/main";

/**
 * Lists all departements related to a specific region
 *
 * @returns {Promise}
 */
export function getDepartementsForRegion(regionCode) {
    return getApi(`/regions/${regionCode}/departements`);
}

/**
 * Lists all departements related to a specific epci
 *
 * @returns {Promise}
 */
export function getDepartementsForEpci(epciCode) {
    return getApi(`/epci/${epciCode}/departements`);
}
