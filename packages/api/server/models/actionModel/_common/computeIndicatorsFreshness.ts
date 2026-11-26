const DAY_IN_MS = 86_400_000;

export type FreshnessRow = {
    year: number,
    indicators_updated_at: number | null,
    scolaire_updated_at: number | null,
};

export type IndicatorsFreshness = {
    isUpToDate90Days: boolean,
    isUpToDate180Days: boolean,
};

/**
 * Une ligne compte si elle est de l'année N-1 avec des indicateurs non scolaires récents, ou de l'année N avec des
 * indicateurs scolaires récents (N = année de la date de référence). « Récent » : âge <= seuil, en millisecondes.
 */
export default function computeIndicatorsFreshness(rows: FreshnessRow[], referenceDate: Date): IndicatorsFreshness {
    const currentYear = referenceDate.getFullYear();
    const reference = referenceDate.getTime();

    const relevantDates = rows.flatMap((row): number[] => {
        if (row.year === currentYear - 1 && row.indicators_updated_at !== null) {
            return [row.indicators_updated_at];
        }

        if (row.year === currentYear && row.scolaire_updated_at !== null) {
            return [row.scolaire_updated_at];
        }

        return [];
    });

    const isWithin = (days: number): boolean => relevantDates.some(date => reference - date <= days * DAY_IN_MS);

    return {
        isUpToDate90Days: isWithin(90),
        isUpToDate180Days: isWithin(180),
    };
}
