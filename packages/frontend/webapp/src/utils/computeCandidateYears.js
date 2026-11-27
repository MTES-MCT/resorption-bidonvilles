/**
 * Renvoie les années candidates à l'export des actions : toutes les années, de
 * l'année (UTC) de la plus ancienne date de début (`started_at`) des actions
 * jusqu'à l'année en cours (UTC) incluse.
 *
 * `started_at` est un timestamp en ms à minuit UTC, d'où l'usage de
 * `getUTCFullYear` (et non `getFullYear`, sensible au fuseau local).
 *
 * - liste vide ou invalide : [] ;
 * - si la plus ancienne date de début est postérieure à l'année en cours
 *   (actions toutes à venir) : [] (la borne haute est l'année en cours) ;
 * - résultat : nombres, ordre croissant (comme l'ancien `getUniqueYears`).
 *
 * Aucune entrée n'est modifiée.
 *
 * @param {Array<{started_at: number}>} actions
 * @param {Date} [now]
 * @returns {number[]}
 */
export default function computeCandidateYears(actions, now = new Date()) {
    if (!Array.isArray(actions) || actions.length === 0) {
        return [];
    }

    const timestamps = actions
        .map(function getStartedAt(action) {
            return action.started_at;
        })
        .filter(function isValid(startedAt) {
            return (
                startedAt !== null &&
                startedAt !== undefined &&
                !Number.isNaN(new Date(startedAt).getTime())
            );
        });

    if (timestamps.length === 0) {
        return [];
    }

    const firstYear = new Date(Math.min(...timestamps)).getUTCFullYear();
    const lastYear = now.getUTCFullYear();
    const years = [];

    for (let year = firstYear; year <= lastYear; year += 1) {
        years.push(year);
    }

    return years;
}
