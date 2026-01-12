import metricsModel from '#server/models/metricsModel';
import ServiceError from '#server/errors/ServiceError';
import permissionUtils from '#server/utils/permission';
import getLivingConditionsStatuses from '#server/models/shantytownModel/_common/livingConditions/v2/statuses/main';
import { Departement } from '#server/models/geoModel/Location.d';
import { DepartementsSummaryRawData } from '#server/models/metricsModel/getDepartementsSummaryData';
import { AuthUser } from '#server/middlewares/authMiddleware';
import { DepartementMetrics } from '#root/types/resources/DepartementMetrics.d';

export type DepartementsSummaryMetrics = {
    summary: DepartementMetrics['summary'],
};

const createEmptySummary = (): DepartementMetrics['summary'] => ({
    number_of_towns: {
        all: 0,
        eu_only: 0,
        unknown_population: 0,
        out_of_date: 0,
    },
    number_of_persons: {
        all: 0,
        eu_only: 0,
    },
    number_of_households: null,
    number_of_minors: null,
    number_of_schooled_minors: null,
    number_of_towns_with_water: 0,
    number_of_towns_with_electricity: 0,
    number_of_towns_with_trash_evacuation: 0,
    number_of_towns_with_fire_prevention: 0,
    number_of_towns_with_toilets: 0,
    number_of_towns_without_pest_animals: 0,
    number_of_towns_with_heatwave: 0,
    number_of_towns_with_owner_complaint: 0,
    number_of_towns_with_justice_procedure: 0,
    number_of_towns_with_police: 0,
});

const updatePopulationMetrics = (
    summary: DepartementMetrics['summary'],
    row: DepartementsSummaryRawData,
): void => {
    const mutableSummary = summary;
    const populationTotal = row.population_total ?? 0;
    mutableSummary.number_of_persons.all += populationTotal;

    if (row.origins.length === 1 && row.origins.includes('european')) {
        mutableSummary.number_of_persons.eu_only += populationTotal;
        mutableSummary.number_of_towns.eu_only += 1;
    }

    if (populationTotal === 0 || row.origins.length === 0) {
        mutableSummary.number_of_towns.unknown_population += 1;
    }

    if (row.out_of_date) {
        mutableSummary.number_of_towns.out_of_date += 1;
    }

    if (row.population_couples !== null) {
        mutableSummary.number_of_households = (mutableSummary.number_of_households ?? 0) + row.population_couples;
    }
    if (row.population_minors !== null) {
        mutableSummary.number_of_minors = (mutableSummary.number_of_minors ?? 0) + row.population_minors;
    }
    if (row.minors_in_school !== null) {
        mutableSummary.number_of_schooled_minors = (mutableSummary.number_of_schooled_minors ?? 0) + row.minors_in_school;
    }
};

const updateLivingConditionsMetrics = (
    summary: DepartementMetrics['summary'],
    row: DepartementsSummaryRawData,
): void => {
    const mutableSummary = summary;
    const statuses = getLivingConditionsStatuses(row);

    const conditionMap: Record<string, keyof DepartementMetrics['summary']> = {
        water: 'number_of_towns_with_water',
        electricity: 'number_of_towns_with_electricity',
        trash: 'number_of_towns_with_trash_evacuation',
        fire_prevention: 'number_of_towns_with_fire_prevention',
        sanitary: 'number_of_towns_with_toilets',
        pest_animals: 'number_of_towns_without_pest_animals',
    };

    Object.entries(conditionMap).forEach(([key, metricKey]) => {
        if (statuses[key as keyof typeof statuses]?.status === 'good') {
            (mutableSummary[metricKey] as number) += 1;
        }
    });

    if (row.heatwave_status === true) {
        mutableSummary.number_of_towns_with_heatwave += 1;
    }
};

const updateJusticeMetrics = (
    summary: DepartementMetrics['summary'],
    row: DepartementsSummaryRawData,
    justiceAllowedDepartements: Set<string>,
): void => {
    const mutableSummary = summary;
    if (!justiceAllowedDepartements.has(row.departement_code)) {
        return;
    }

    if (row.owner_complaint === true) {
        mutableSummary.number_of_towns_with_owner_complaint += 1;
    }
    if (row.justice_procedure === true) {
        mutableSummary.number_of_towns_with_justice_procedure += 1;
    }
    if (row.police_status === 'granted') {
        mutableSummary.number_of_towns_with_police += 1;
    }
};

const getDepartementsSummaryMetrics = async (user: AuthUser, departementCodes: string[]): Promise<DepartementsSummaryMetrics> => {
    const justiceAllowedDepartements = new Set(
        departementCodes.filter(code => permissionUtils.can(user).do('access', 'shantytown_justice').on(
            { type: 'departement', departement: { code } } as Departement,
        )),
    );

    let data: DepartementsSummaryRawData[];

    try {
        data = await metricsModel.getDepartementsSummaryData(user, departementCodes);
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }

    const summary = createEmptySummary();
    summary.number_of_towns.all = data.length;

    data.forEach((row) => {
        updatePopulationMetrics(summary, row);
        updateLivingConditionsMetrics(summary, row);
        updateJusticeMetrics(summary, row, justiceAllowedDepartements);
    });

    return { summary };
};

export default getDepartementsSummaryMetrics;
