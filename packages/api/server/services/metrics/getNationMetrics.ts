/* eslint-disable no-param-reassign */
import { NationMetricsRawData } from '#server/models/metricsModel/getNationData';
import metricsModel from '#server/models/metricsModel';
import ServiceError from '#server/errors/ServiceError';
import moment from 'moment';
import getSince from '#server/services/shantytown/_common/getSince';
import { NationMetrics } from '#root/types/resources/NationMetrics.d';
import { NationMetricsList } from '#root/types/services/MetricsService.d';
import { User } from '#root/types/resources/User.d';

type NationMetricsObject = {
    [key: string]: NationMetrics;
};

type HashObject = {
    [key: string]: number;

};

const baseMetrics: (metricsLevel: 'nation' | 'region' | 'departement', metricsUid: string, metricsName: string) => NationMetrics = (metricsLevel, metricsUid, metricsName) => ({
    level: metricsLevel,
    uid: metricsUid,
    name: metricsName,
    metrics: {
        number_of_towns_with_water: 0,
        number_of_persons_with_water: 0,
        number_of_persons: { from: 0, to: 0 },
        number_of_persons_european_10_and_over: { from: 0, to: 0 },
        number_of_towns: { from: 0, to: 0 },
        number_of_towns_european_10_and_over: { from: 0, to: 0 },
        number_of_towns_unknown_origin: { from: 0, to: 0 },
        number_of_towns_out_of_date: { from: 0, to: 0 },
    },
    children: [],
});

function normalizeDateToMidnight(date: Date | string) {
    return moment(date).set({
        hour: 0, minute: 0, second: 0, millisecond: 0,
    });
}

function isEuropeanOriginWith10Plus(row: NationMetricsRawData): boolean {
    return row.population_total >= 10
        && row.origins !== null
        && Array.isArray(row.origins)
        && row.origins.length === 1
        && row.origins.includes('european');
}

function hasUnknownOrigin(row: NationMetricsRawData): boolean {
    return row.population_total === null || row.origins === null;
}

function isOutOfDate(inputDate: Date): boolean {
    const updatedSitesInTheLastSixMonths = getSince(new Date(inputDate).getTime() / 1000);
    return updatedSitesInTheLastSixMonths.months >= 6;
}

function incrementMetrics(metrics: NationMetrics['metrics'], row: NationMetricsRawData, period: 'from' | 'to', includeWater: boolean) {
    const population = row.population_total ?? 0;
    const isEuropean10Plus = isEuropeanOriginWith10Plus(row);
    const isUnknown = hasUnknownOrigin(row);
    const isOld = isOutOfDate(row.input_date);

    metrics.number_of_persons[period] += population;
    metrics.number_of_persons_european_10_and_over[period] += isEuropean10Plus ? population : 0;
    metrics.number_of_towns[period] += 1;
    metrics.number_of_towns_european_10_and_over[period] += isEuropean10Plus ? 1 : 0;
    metrics.number_of_towns_unknown_origin[period] += isUnknown ? 1 : 0;
    metrics.number_of_towns_out_of_date[period] += isOld ? 1 : 0;

    if (includeWater && row.access_to_water) {
        metrics.number_of_towns_with_water += 1;
        metrics.number_of_persons_with_water += population;
    }
}

// eslint-disable-next-line no-param-reassign
function ensureRegionExists(hashRegions: NationMetricsObject, row: NationMetricsRawData) {
    if (!hashRegions[row.region_code]) {
        hashRegions[row.region_code] = baseMetrics('region', row.region_code, row.region_name);
    }
}

// eslint-disable-next-line no-param-reassign
function ensureDepartementExists(hashRegions: NationMetricsObject, hashDepartements: HashObject, row: NationMetricsRawData) {
    if (hashDepartements[row.departement_code] === undefined) {
        hashDepartements[row.departement_code] = hashRegions[row.region_code].children.length;
        hashRegions[row.region_code].children.push(baseMetrics('departement', row.departement_code, row.departement_name));
    }
}

function processRowForPeriod(
    row: NationMetricsRawData,
    period: 'from' | 'to',
    franceData: NationMetrics,
    metropoleData: NationMetrics,
    outremerData: NationMetrics,
    hashRegions: NationMetricsObject,
    hashDepartements: HashObject,
) {
    const includeWater = period === 'to' && row.closed_at === null;

    // Données nationales
    incrementMetrics(franceData.metrics, row, period, includeWater);

    // Données outremer/métropole
    if (row.is_oversea) {
        incrementMetrics(outremerData.metrics, row, period, includeWater);
    } else {
        incrementMetrics(metropoleData.metrics, row, period, includeWater);
    }

    // Données région
    ensureRegionExists(hashRegions, row);
    incrementMetrics(hashRegions[row.region_code].metrics, row, period, includeWater);

    // Données département
    ensureDepartementExists(hashRegions, hashDepartements, row);
    const departementMetrics = hashRegions[row.region_code].children[hashDepartements[row.departement_code]].metrics;
    incrementMetrics(departementMetrics, row, period, includeWater);
}

const OUTREMER_REGION_CODES = new Set(['01', '02', '03', '04', '06']);

function isOutremerRegion(regionCode: string): boolean {
    return OUTREMER_REGION_CODES.has(regionCode);
}

function buildChildrenHierarchy(
    franceData: NationMetrics,
    metropoleData: NationMetrics,
    outremerData: NationMetrics,
    regionData: NationMetrics[],
) {
    franceData.children = regionData.map((regionMetric) => {
        if (isOutremerRegion(regionMetric.uid)) {
            return regionMetric.children[0];
        }
        return regionMetric;
    });

    metropoleData.children = regionData.filter(el => !isOutremerRegion(el.uid));
    outremerData.children = regionData
        .filter(el => isOutremerRegion(el.uid))
        .map(regionMetric => regionMetric.children[0]);
}

function getUserRegionCodes(user: User): string[] {
    return Object.keys(user.permissions.shantytown.list.allowed_on)
        .flatMap(key => user.permissions.shantytown.list.allowed_on[key].reduce((acc, location) => {
            if (location.region?.code) {
                acc.push(location.region.code);
            }
            return acc;
        }, []));
}

function determineUserTerritoryAccess(user: User): { hasMetropole: boolean; hasOutremer: boolean } {
    if (user.permissions.shantytown.list.allowed_on_national) {
        return { hasMetropole: true, hasOutremer: true };
    }

    const regionCodes = getUserRegionCodes(user);
    return {
        hasOutremer: regionCodes.some(code => isOutremerRegion(code)),
        hasMetropole: regionCodes.some(code => !isOutremerRegion(code)),
    };
}

function filterMetricsByPermissions(
    franceData: NationMetrics,
    metropoleData: NationMetrics,
    outremerData: NationMetrics,
    hasMetropole: boolean,
    hasOutremer: boolean,
): NationMetricsList {
    if (hasMetropole && hasOutremer) {
        return [franceData, metropoleData, outremerData];
    }

    if (hasMetropole) {
        return metropoleData.children;
    }

    if (hasOutremer) {
        return outremerData.children;
    }

    return [];
}

export default async function getNationMetrics(user: User, argFrom: Date, argTo: Date): Promise<NationMetricsList> {
    const franceData = baseMetrics('nation', 'france', 'France entière');
    const metropoleData = baseMetrics('nation', 'metropole', 'Hexagone');
    const outremerData = baseMetrics('nation', 'outremer', 'Outre-mer');

    const hashRegions:NationMetricsObject = {};
    const hashDepartements:HashObject = {};

    let data:NationMetricsRawData[];
    try {
        data = await metricsModel.getNationData(user, argFrom, argTo);
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }

    const from = moment(argFrom).set({
        hour: 0, minute: 0, second: 0, millisecond: 0,
    });

    const to = moment(argTo).set({
        hour: 0, minute: 0, second: 0, millisecond: 0,
    });

    data.forEach((row, index) => {
        const inputDate = normalizeDateToMidnight(row.input_date);
        const previousInputDate = index === 0 ? null : normalizeDateToMidnight(data[index - 1].input_date);
        const knownSince = normalizeDateToMidnight(row.known_since);

        const isMostRecent = index === 0 || row.shantytown_id !== data[index - 1].shantytown_id;
        const isMostAncient = data[index + 1]?.shantytown_id !== row.shantytown_id;

        const shouldIncrementTo = (
            (inputDate <= to && (isMostRecent || previousInputDate > to))
            || (isMostAncient && inputDate > to)
        );

        const shouldIncrementFrom = (
            (inputDate <= from && (isMostRecent || previousInputDate > from))
            || (isMostAncient && inputDate > from && knownSince < from)
        );

        if (shouldIncrementTo && row.closed_at === null) {
            processRowForPeriod(row, 'to', franceData, metropoleData, outremerData, hashRegions, hashDepartements);
        }

        if (shouldIncrementFrom) {
            processRowForPeriod(row, 'from', franceData, metropoleData, outremerData, hashRegions, hashDepartements);
        }
    });

    const regionData = Object.values(hashRegions);

    buildChildrenHierarchy(franceData, metropoleData, outremerData, regionData);

    const { hasMetropole, hasOutremer } = determineUserTerritoryAccess(user);

    return filterMetricsByPermissions(franceData, metropoleData, outremerData, hasMetropole, hasOutremer);
}
