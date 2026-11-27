function computePercentage(numerator, denominator) {
    if (denominator === 0) {
        return 0; // Éviter la division par zéro
    }

    // Arrondi à 1 décimale
    return Math.round((numerator / denominator) * 100 * 10) / 10;
}

/**
 * Compte les actions dont les indicateurs sont à jour, à partir des booléens
 * calculés par l'API (is_active_previous_year, indicators_up_to_date_90d,
 * indicators_up_to_date_180d). Aucune règle de fraîcheur n'est portée ici.
 *
 * Le dénominateur ne contient que les actions actives en N-1.
 */
export default function computeIndicatorsStatistics(actions) {
    const activeActions = actions.filter(
        (action) => action.is_active_previous_year === true
    );
    const activeDihalActions = activeActions.filter(
        (action) => action.hasDihalFinancing
    );

    const upToDate180d = activeActions.filter(
        (action) => action.indicators_up_to_date_180d === true
    ).length;
    const upToDate90dDihal = activeDihalActions.filter(
        (action) => action.indicators_up_to_date_90d === true
    ).length;

    return {
        sixMonths: {
            updated: upToDate180d,
            total: activeActions.length,
            percentage: computePercentage(upToDate180d, activeActions.length),
        },
        dihal: {
            updated: upToDate90dDihal,
            total: activeDihalActions.length,
            percentage: computePercentage(
                upToDate90dDihal,
                activeDihalActions.length
            ),
        },
    };
}
