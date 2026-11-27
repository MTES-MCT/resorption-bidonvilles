import getBadgeLabel from "@/utils/getBadgeLabel";
import getBadgeVariant from "@/utils/getBadgeVariant";

// Seuils (succès, avertissement) en pourcentage de la variante du badge.
const SIX_MONTHS_THRESHOLDS = [80, 60];
const DIHAL_THRESHOLDS = [95, 80];

function buildBadge(statistic, [successThreshold, warningThreshold]) {
    const { total, percentage } = statistic;

    return {
        label: getBadgeLabel({
            count: total,
            percentage,
            positiveLabel: false,
            emptyLabel: false,
            percentageOnly: true,
        }),
        variant: getBadgeVariant({
            value: percentage,
            successThreshold,
            warningThreshold,
        }),
    };
}

/**
 * À partir des statistiques produites par `computeIndicatorsStatistics`,
 * renvoie le libellé et la variante des badges « 6 mois » et « DIHAL ».
 */
export default function computeIndicatorsBadges(statistics) {
    return {
        sixMonths: buildBadge(statistics.sixMonths, SIX_MONTHS_THRESHOLDS),
        dihal: buildBadge(statistics.dihal, DIHAL_THRESHOLDS),
    };
}
