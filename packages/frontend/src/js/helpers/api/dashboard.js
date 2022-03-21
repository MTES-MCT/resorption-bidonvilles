import { getApi } from "#helpers/api/main";

/**
 * va chercher les statistiques pour la vue d'ensemble
 *
 * @returns {Promise}
 */
export function getDashboardStats() {
    return getApi(`/stats/getStats`);
}
