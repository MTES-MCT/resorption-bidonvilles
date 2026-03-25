/**
 * Vérifie si un objet de métriques contient au moins une valeur non nulle
 *
 * @param yearMetrics - Objet contenant les indicateurs pour une année donnée
 * @returns true si au moins un indicateur a une valeur, false sinon
 */
export default function hasMetricValues(yearMetrics: Record<string, any>): boolean {
    return Object.values(yearMetrics).some(
        value => value !== '' && value != null,
    );
}
