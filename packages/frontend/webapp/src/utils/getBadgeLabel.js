/**
 * Calcule le libellé d'un badge de pourcentage.
 *
 * @param {Object} params
 * @param {number} params.count Effectif : si <= 0, `emptyLabel` est renvoyé
 * @param {number} params.percentage Pourcentage à afficher
 * @param {string|boolean} [params.positiveLabel] Texte placé après le pourcentage (défaut : undefined)
 * @param {string|boolean} [params.emptyLabel] Valeur renvoyée quand `count` n'est pas > 0 (défaut : undefined)
 * @param {boolean} [params.percentageOnly=false] Si vrai, renvoie uniquement « N% »
 * @returns {string|boolean|undefined}
 */
function getBadgeLabel({
    count,
    percentage,
    positiveLabel,
    emptyLabel,
    percentageOnly = false,
}) {
    if (count > 0) {
        if (percentageOnly) {
            return `${percentage}%`;
        }
        return `(${percentage}%) ${positiveLabel}`;
    }

    return emptyLabel;
}

export default getBadgeLabel;
