/**
 * Renvoie, parmi `years`, les années pour lesquelles au moins une action est
 * active, avec la même règle que l'export Excel côté API : l'action a débuté au
 * plus tard le 31/12 de l'année ET (n'a pas de date de fin OU a fini au plus tôt
 * le 01/01 de l'année).
 *
 * `started_at` et `ended_at` sont des timestamps en ms à minuit UTC
 * (`new Date("YYYY-MM-DD").getTime()`), d'où des bornes calculées avec Date.UTC.
 *
 * L'ordre et le type des éléments de `years` sont conservés ; aucune entrée
 * n'est modifiée.
 *
 * @param {Array<{started_at: number, ended_at: number|null}>} actions
 * @param {number[]} years
 * @returns {number[]}
 */
export default function computeExportableYears(actions, years) {
    if (!Array.isArray(actions) || !Array.isArray(years)) {
        return [];
    }

    return years.filter(function hasActiveAction(year) {
        const yearStart = Date.UTC(year, 0, 1);
        const yearEnd = Date.UTC(year, 11, 31);

        return actions.some(function isActiveInYear(action) {
            const hasEnded =
                action.ended_at !== null && action.ended_at !== undefined;

            return (
                action.started_at <= yearEnd &&
                (!hasEnded || action.ended_at >= yearStart)
            );
        });
    });
}
