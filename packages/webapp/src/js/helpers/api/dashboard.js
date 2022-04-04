import { getApi } from "#helpers/api/main";

/**
 * va chercher les statistiques pour la vue d'ensemble
 *
 * @returns {Promise}
 */
export function getDashboardStats(locationType, locationCode) {
    const query = [
        { name: "locationType", value: locationType },
        { name: "locationCode", value: locationCode }
    ];
    const queryString = query
        .map(({ name, value }) => `${name}=${encodeURIComponent(value)}`)
        .join("&");
    let url = `/stats/getStats?${queryString}`;
    return getApi(url);
}
