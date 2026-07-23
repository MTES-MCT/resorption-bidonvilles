const POPULATION_FIELDS: Array<[string, string]> = [
    ['populationTotal', 'population_total'],
    ['populationTotalFemales', 'population_total_females'],
    ['populationCouples', 'population_couples'],
    ['populationMinors', 'population_minors'],
    ['populationMinorsGirls', 'population_minors_girls'],
    ['populationMinors0To3', 'population_minors_0_3'],
    ['populationMinors3To6', 'population_minors_3_6'],
    ['populationMinors6To12', 'population_minors_6_12'],
    ['populationMinors12To16', 'population_minors_12_16'],
    ['populationMinors16To18', 'population_minors_16_18'],
    ['minorsInSchool', 'minors_in_school'],
];

export default function checkPopulationUpdate(originalShantytown, shantytown): Date | undefined {
    let hasChanged = false;

    if (!originalShantytown) { // CREATION
        hasChanged = POPULATION_FIELDS.some(
            ([, newKey]) => shantytown[newKey] !== null && shantytown[newKey] !== undefined,
        );
    } else { // UPDATE
        hasChanged = POPULATION_FIELDS.some(
            ([oldKey, newKey]) => originalShantytown[oldKey] !== shantytown[newKey],
        );
    }

    let hasNoChangesButHadData = false;
    if (shantytown.updated_without_any_change && !hasChanged) {
        hasNoChangesButHadData = POPULATION_FIELDS.some(
            ([oldKey]) => originalShantytown?.[oldKey] !== null && originalShantytown?.[oldKey] !== undefined,
        );
    }

    return hasChanged || hasNoChangesButHadData ? new Date() : undefined;
}
