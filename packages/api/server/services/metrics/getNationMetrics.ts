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

export default async (user: User, argFrom: Date, argTo: Date):Promise<NationMetricsList> => {
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
        let previousInputDate = null;

        const inputDate = moment(row.input_date).set({
            hour: 0, minute: 0, second: 0, millisecond: 0,
        });
        if (index !== 0) {
            previousInputDate = moment(data[index - 1].input_date).set({
                hour: 0, minute: 0, second: 0, millisecond: 0,
            });
        }
        const knownSince = moment(row.known_since).set({
            hour: 0, minute: 0, second: 0, millisecond: 0,
        });

        const isMostRecent = index === 0 || row.shantytown_id !== data[index - 1].shantytown_id;
        const isMostAncient = data[index + 1]?.shantytown_id !== row.shantytown_id;

        const incrementTo = (
            (inputDate <= to && (isMostRecent || previousInputDate > to))
            || (isMostAncient && inputDate > to));


        const incrementFrom = (
            (inputDate <= from && (isMostRecent || previousInputDate > from))
            || (isMostAncient && inputDate > from && knownSince < from));

        if (incrementTo && row.closed_at === null) {
            const updatedSitesInTheLastSixMonths = getSince(new Date(row.input_date).getTime() / 1000);
            // on incrémente la donnée nationale
            franceData.metrics.number_of_persons.to += row.population_total;
            franceData.metrics.number_of_persons_european_10_and_over.to += row.population_total >= 10 && row.origins !== null && Array.isArray(row.origins) && row.origins.length === 1 && row.origins.includes('european') ? row.population_total : 0;
            franceData.metrics.number_of_towns.to += 1;
            franceData.metrics.number_of_towns_european_10_and_over.to += row.population_total >= 10 && row.origins !== null && Array.isArray(row.origins) && row.origins.length === 1 && row.origins.includes('european') ? 1 : 0;
            franceData.metrics.number_of_towns_unknown_origin.to += row.population_total === null || row.origins === null ? 1 : 0;
            franceData.metrics.number_of_towns_out_of_date.to += updatedSitesInTheLastSixMonths.months >= 6 ? 1 : 0;
            if (row.access_to_water) {
                franceData.metrics.number_of_towns_with_water += 1;
                franceData.metrics.number_of_persons_with_water += row.population_total;
            }
            // on incrémente la donnée outremer
            if (row.is_oversea) {
                outremerData.metrics.number_of_persons.to += row.population_total;
                outremerData.metrics.number_of_persons_european_10_and_over.to += row.population_total >= 10 && row.origins !== null && Array.isArray(row.origins) && row.origins.length === 1 && row.origins.includes('european') ? row.population_total : 0;
                outremerData.metrics.number_of_towns.to += 1;
                outremerData.metrics.number_of_towns_european_10_and_over.to += row.population_total >= 10 && row.origins !== null && Array.isArray(row.origins) && row.origins.length === 1 && row.origins.includes('european') ? 1 : 0;
                outremerData.metrics.number_of_towns_unknown_origin.to += row.population_total === null || row.origins === null ? 1 : 0;
                outremerData.metrics.number_of_towns_out_of_date.to += updatedSitesInTheLastSixMonths.months >= 6 ? 1 : 0;
                if (row.access_to_water) {
                    outremerData.metrics.number_of_towns_with_water += 1;
                    outremerData.metrics.number_of_persons_with_water += row.population_total;
                }
            } else {
                // on incrémente la donnée métropole
                metropoleData.metrics.number_of_persons.to += row.population_total;
                metropoleData.metrics.number_of_persons_european_10_and_over.to += row.population_total >= 10 && row.origins !== null && Array.isArray(row.origins) && row.origins.length === 1 && row.origins.includes('european') ? row.population_total : 0;
                metropoleData.metrics.number_of_towns.to += 1;
                metropoleData.metrics.number_of_towns_european_10_and_over.to += row.population_total >= 10 && row.origins !== null && Array.isArray(row.origins) && row.origins.length === 1 && row.origins.includes('european') ? 1 : 0;
                metropoleData.metrics.number_of_towns_unknown_origin.to += row.population_total === null || row.origins === null ? 1 : 0;
                metropoleData.metrics.number_of_towns_out_of_date.to += updatedSitesInTheLastSixMonths.months >= 6 ? 1 : 0;
                if (row.access_to_water) {
                    metropoleData.metrics.number_of_towns_with_water += 1;
                    metropoleData.metrics.number_of_persons_with_water += row.population_total;
                }
            }


            // on incrémente la donnée région
            if (!hashRegions[row.region_code]) {
                hashRegions[row.region_code] = baseMetrics('region', row.region_code, row.region_name);
            }
            hashRegions[row.region_code].metrics.number_of_persons.to += row.population_total;
            hashRegions[row.region_code].metrics.number_of_persons_european_10_and_over.to += row.population_total >= 10 && row.origins !== null && Array.isArray(row.origins) && row.origins.length === 1 && row.origins.includes('european') ? row.population_total : 0;
            hashRegions[row.region_code].metrics.number_of_towns.to += 1;
            hashRegions[row.region_code].metrics.number_of_towns_out_of_date.to += updatedSitesInTheLastSixMonths.months >= 6 ? 1 : 0;
            if (row.access_to_water) {
                hashRegions[row.region_code].metrics.number_of_towns_with_water += 1;
                hashRegions[row.region_code].metrics.number_of_persons_with_water += row.population_total;
            }

            // on incrémente la donnée département
            if (hashDepartements[row.departement_code] === undefined) {
                hashDepartements[row.departement_code] = hashRegions[row.region_code].children.length;
                hashRegions[row.region_code].children.push(baseMetrics('departement', row.departement_code, row.departement_name));
            }
            hashRegions[row.region_code].children[hashDepartements[row.departement_code]].metrics.number_of_persons.to += row.population_total;
            hashRegions[row.region_code].children[hashDepartements[row.departement_code]].metrics.number_of_persons_european_10_and_over.to += row.population_total >= 10 && row.origins !== null && Array.isArray(row.origins) && row.origins.length === 1 && row.origins.includes('european') ? row.population_total : 0;
            hashRegions[row.region_code].children[hashDepartements[row.departement_code]].metrics.number_of_towns.to += 1;
            hashRegions[row.region_code].children[hashDepartements[row.departement_code]].metrics.number_of_towns_out_of_date.to += updatedSitesInTheLastSixMonths.months >= 6 ? 1 : 0;
            if (row.access_to_water) {
                hashRegions[row.region_code].children[hashDepartements[row.departement_code]].metrics.number_of_towns_with_water += 1;
                hashRegions[row.region_code].children[hashDepartements[row.departement_code]].metrics.number_of_persons_with_water += row.population_total;
            }
        }

        if (incrementFrom) {
            const updatedSitesInTheLastSixMonths = getSince(new Date(row.input_date).getTime() / 1000);
            // on incrémente la donnée nationale
            franceData.metrics.number_of_persons.from += row.population_total;
            franceData.metrics.number_of_persons_european_10_and_over.from += row.population_total >= 10 && row.origins !== null && Array.isArray(row.origins) && row.origins.length === 1 && row.origins.includes('european') ? row.population_total : 0;
            franceData.metrics.number_of_towns.from += 1;
            franceData.metrics.number_of_towns_european_10_and_over.from += row.population_total >= 10 && row.origins !== null && Array.isArray(row.origins) && row.origins.length === 1 && row.origins.includes('european') ? 1 : 0;
            franceData.metrics.number_of_towns_unknown_origin.from += row.population_total === null || row.origins === null ? 1 : 0;
            franceData.metrics.number_of_towns_out_of_date.from += updatedSitesInTheLastSixMonths.months >= 6 ? 1 : 0;
            // on incrémente la donnée outremer
            if (row.is_oversea) {
                outremerData.metrics.number_of_persons.from += row.population_total;
                outremerData.metrics.number_of_persons_european_10_and_over.from += row.population_total >= 10 && row.origins !== null && Array.isArray(row.origins) && row.origins.includes('european') ? row.population_total : 0;
                outremerData.metrics.number_of_towns.from += 1;
                outremerData.metrics.number_of_towns_european_10_and_over.from += row.population_total >= 10 && row.origins !== null && Array.isArray(row.origins) && row.origins.includes('european') ? 1 : 0;
                outremerData.metrics.number_of_towns_unknown_origin.from += row.population_total === null || row.origins === null ? 1 : 0;
                outremerData.metrics.number_of_towns_out_of_date.from += updatedSitesInTheLastSixMonths.months >= 6 ? 1 : 0;
            } else {
                // on incrémente la donnée métropole
                metropoleData.metrics.number_of_persons.from += row.population_total;
                metropoleData.metrics.number_of_persons_european_10_and_over.from += row.population_total >= 10 && row.origins !== null && Array.isArray(row.origins) && row.origins.length === 1 && row.origins.includes('european') ? row.population_total : 0;
                metropoleData.metrics.number_of_towns.from += 1;
                metropoleData.metrics.number_of_towns_european_10_and_over.from += row.population_total >= 10 && row.origins !== null && Array.isArray(row.origins) && row.origins.length === 1 && row.origins.includes('european') ? 1 : 0;
                metropoleData.metrics.number_of_towns_unknown_origin.from += row.population_total === null || row.origins === null ? 1 : 0;
                metropoleData.metrics.number_of_towns_out_of_date.from += updatedSitesInTheLastSixMonths.months >= 6 ? 1 : 0;
            }

            // on incrémente la donnée région
            if (!hashRegions[row.region_code]) {
                hashRegions[row.region_code] = baseMetrics('region', row.region_code, row.region_name);
            }
            hashRegions[row.region_code].metrics.number_of_persons.from += row.population_total;
            hashRegions[row.region_code].metrics.number_of_persons_european_10_and_over.from += row.population_total >= 10 && row.origins !== null && Array.isArray(row.origins) && row.origins.length === 1 && row.origins.includes('european') ? row.population_total : 0;
            hashRegions[row.region_code].metrics.number_of_towns.from += 1;
            hashRegions[row.region_code].metrics.number_of_towns_european_10_and_over.from += row.population_total >= 10 && row.origins !== null && Array.isArray(row.origins) && row.origins.length === 1 && row.origins.includes('european') ? 1 : 0;
            hashRegions[row.region_code].metrics.number_of_towns_unknown_origin.from += row.population_total === null || row.origins === null ? 1 : 0;
            hashRegions[row.region_code].metrics.number_of_towns_out_of_date.from += updatedSitesInTheLastSixMonths.months >= 6 ? 1 : 0;

            // on incrémente la donnée département
            if (hashDepartements[row.departement_code] === undefined) {
                hashDepartements[row.departement_code] = hashRegions[row.region_code].children.length;
                hashRegions[row.region_code].children.push(baseMetrics('departement', row.departement_code, row.departement_name));
            }
            hashRegions[row.region_code].children[hashDepartements[row.departement_code]].metrics.number_of_persons.from += row.population_total;
            hashRegions[row.region_code].children[hashDepartements[row.departement_code]].metrics.number_of_persons_european_10_and_over.from += row.population_total >= 10 && row.origins !== null && Array.isArray(row.origins) && row.origins.length === 1 && row.origins.includes('european') ? row.population_total : 0;
            hashRegions[row.region_code].children[hashDepartements[row.departement_code]].metrics.number_of_towns.from += 1;
            hashRegions[row.region_code].children[hashDepartements[row.departement_code]].metrics.number_of_towns_european_10_and_over.from += row.population_total >= 10 && row.origins !== null && Array.isArray(row.origins) && row.origins.length === 1 && row.origins.includes('european') ? 1 : 0;
            hashRegions[row.region_code].children[hashDepartements[row.departement_code]].metrics.number_of_towns_unknown_origin.from += row.population_total === null || row.origins === null ? 1 : 0;
            hashRegions[row.region_code].children[hashDepartements[row.departement_code]].metrics.number_of_towns_out_of_date.from += updatedSitesInTheLastSixMonths.months >= 6 ? 1 : 0;
        }
    });

    const regionData = Object.values(hashRegions);

    franceData.children = regionData.map((regionMetric) => {
        if (['01', '02', '03', '04', '06'].includes(regionMetric.uid)) {
            // on supprime le niveau régional pour les départements outremer
            return regionMetric.children[0];
        }
        return regionMetric;
    });
    metropoleData.children = regionData.filter(el => !['01', '02', '03', '04', '06'].includes(el.uid));
    // on supprime le niveau régional pour les départements outremer
    outremerData.children = regionData.filter(el => ['01', '02', '03', '04', '06'].includes(el.uid)).map(regionMetric => regionMetric.children[0]);

    // on fait le tri des lignes qu'il faut renvoyer à l'utilisateur, pour éviter de
    // lui renvoyer des lignes vides juste parce qu'il n'a pas les permissions d'accès
    // aux territoires considérés
    // (typiquement, on ne veut pas renvoyer une ligne "Outremer" aux utilisateurs métropolitains, et
    // inversement)
    let hasMetropole = true;
    let hasOutremer = true;
    if (!user.permissions.shantytown.list.allowed_on_national) {
        const regionCodes = Object.keys(user.permissions.shantytown.list.allowed_on)
            .map(key => user.permissions.shantytown.list.allowed_on[key].reduce((acc, location) => {
                if (!location.region?.code) {
                    return acc;
                }

                acc.push(location.region.code);
                return acc;
            }, []))
            .flat();

        hasOutremer = regionCodes.some(code => ['01', '02', '03', '04', '06'].includes(code));
        hasMetropole = regionCodes.some(code => !['01', '02', '03', '04', '06'].includes(code));
    }

    // on retourne le résultat, bien filtré
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
};
