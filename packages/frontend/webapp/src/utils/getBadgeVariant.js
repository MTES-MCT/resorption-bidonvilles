/**
 * Calcule la variante (couleur) d'un badge en fonction de seuils.
 *
 * @param {Object} params
 * @param {number} params.value Valeur évaluée
 * @param {number} params.successThreshold Seuil (inclus) à partir duquel la variante est « success »
 * @param {number} params.warningThreshold Seuil (inclus) à partir duquel la variante est « warning »
 * @returns {"success"|"warning"|"error"}
 */
function getBadgeVariant({ value, successThreshold, warningThreshold }) {
    if (value >= successThreshold) {
        return "success";
    }

    if (value >= warningThreshold) {
        return "warning";
    }

    return "error";
}

export default getBadgeVariant;
