/**
 * Fragment SQL : clé de version d'une ligne d'action_metrics.
 *
 * Une version regroupe les lignes d'une action saisies lors d'un même enregistrement. Elle est identifiée par la date
 * de sa version (action_metrics_versions.version_at) quand la ligne y est rattachée, sinon par le created_at de la
 * ligne (données antérieures au versionnement, fk_version NULL). La troncature à la seconde regroupe les lignes
 * insérées par une même requête.
 *
 * Le LEFT JOIN sur action_metrics_versions est à la charge de l'appelant, avec les mêmes alias.
 */
export default function metricsVersionKey(metricsAlias: string, versionAlias: string): string {
    return `date_trunc('seconds', COALESCE(${versionAlias}.version_at, ${metricsAlias}.created_at))`;
}
