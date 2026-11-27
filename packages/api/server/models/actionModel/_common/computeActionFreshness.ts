import computeIndicatorsFreshness, { FreshnessRow } from './computeIndicatorsFreshness';
import isActiveInYear from './isActiveInYear';

export type ActionFreshness = {
    isActivePreviousYear: boolean,
    isUpToDate90Days: boolean,
    isUpToDate180Days: boolean,
};

/**
 * Règle « indicateurs à jour » d'une action, partagée par la liste et l'export Excel. Une action inactive en N-1
 * est exclue en entier : ses deux drapeaux « à jour » sont à false.
 */
export default function computeActionFreshness(
    startedAt: number | string | Date,
    endedAt: number | string | Date | null,
    freshnessRows: FreshnessRow[],
    referenceDate: Date,
): ActionFreshness {
    const isActivePreviousYear = isActiveInYear(startedAt, endedAt, referenceDate.getFullYear() - 1);
    const freshness = isActivePreviousYear
        ? computeIndicatorsFreshness(freshnessRows, referenceDate)
        : { isUpToDate90Days: false, isUpToDate180Days: false };

    return {
        isActivePreviousYear,
        isUpToDate90Days: freshness.isUpToDate90Days,
        isUpToDate180Days: freshness.isUpToDate180Days,
    };
}
