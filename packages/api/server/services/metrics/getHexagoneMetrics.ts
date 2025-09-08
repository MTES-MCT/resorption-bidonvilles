import metricsModel from '#server/models/metricsModel';
import ServiceError from '#server/errors/ServiceError';
import getLivingConditionsStatuses from '#server/models/shantytownModel/_common/livingConditions/v2/statuses/main';
import getAddressSimpleOf from '#server/models/shantytownModel/_common/getAddressSimpleOf';
import getUsenameOf from '#server/models/shantytownModel/_common/getUsenameOf';
import { AuthUser } from '#server/middlewares/authMiddleware';
import { HexagoneMetrics } from '#root/types/resources/HexagoneMetrics.d';
import { CityMetrics, ShantytownMetrics, DepartementMetricsRawData } from '#root/types/resources/DepartementMetrics.d';

type CityMetricsObject = {
    [key: string]: CityMetrics;
};

export default async (user: AuthUser, from: Date, to: Date): Promise<HexagoneMetrics> => {
    let hexagoneMetrics: DepartementMetricsRawData[];

    if (!user.isAllowedTo('list', 'shantytown')) {
        throw new ServiceError('permission_denied', new Error('Vous n\'avez pas la permission de récupérer les statistiques hexagonales'));
    }

    let hasJusticePermission: boolean = false;
    if (user.isAllowedTo('access', 'shantytown_justice')) {
        hasJusticePermission = true;
    }

    try {
        hexagoneMetrics = await metricsModel.getHexagoneData(user, from, to);
    } catch (error) {
        throw new ServiceError('permission_denied', new Error(error?.message));
    }

    const metrics: HexagoneMetrics = {
        summary: {
            number_of_towns: {
                all: hexagoneMetrics.length,
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
        },
    };
    const hashCities:CityMetricsObject = {};

    hexagoneMetrics.forEach((row) => {
        // on crée la donnée commune si elle n'existe pas
        if (!hashCities[row.city_code]) {
            hashCities[row.city_code] = {
                summary: {
                    number_of_towns: 0,
                    number_of_persons: null,
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
                    percentage_of_towns_with_water: 0,
                    percentage_of_towns_with_electricity: 0,
                    percentage_of_towns_with_trash_evacuation: 0,
                    percentage_of_towns_with_fire_prevention: 0,
                    percentage_of_towns_with_toilets: 0,
                    percentage_of_towns_without_pest_animals: 0,
                    percentage_of_towns_with_heatwave: 0,
                    percentage_of_towns_with_owner_complaint: 0,
                    percentage_of_towns_with_justice_procedure: 0,
                    percentage_of_towns_with_police: 0,
                    percentage_of_schooled_minors: 0,
                    number_of_inhabitants_with_water: 0,
                    number_of_inhabitants_with_electricity: 0,
                    number_of_inhabitants_with_trash_evacuation: 0,
                    number_of_inhabitants_with_fire_prevention: 0,
                    number_of_inhabitants_with_toilets: 0,
                    number_of_inhabitants_without_pest_animals: 0,
                    number_of_inhabitants_with_heatwave: 0,
                    percentage_of_inhabitants_with_water: 0,
                    percentage_of_inhabitants_with_electricity: 0,
                    percentage_of_inhabitants_with_trash_evacuation: 0,
                    percentage_of_inhabitants_with_fire_prevention: 0,
                    percentage_of_inhabitants_with_toilets: 0,
                    percentage_of_inhabitants_without_pest_animals: 0,
                    percentage_of_inhabitants_with_heatwave: 0,

                },
                city: {
                    name: row.city_name,
                    code: row.city_code,
                    latitude: row.city_latitude,
                    longitude: row.city_longitude,
                },
                towns: [],
            };
        }

        // on incrémente la donnée département
        metrics.summary.number_of_persons.all += row.population_total;
        if (row.origins.length === 1 && row.origins.includes('european')) {
            metrics.summary.number_of_persons.eu_only += row.population_total;
            metrics.summary.number_of_towns.eu_only += 1;
        }
        if (row.population_total === 0 || row.population_total === null || row.origins.length === 0) {
            metrics.summary.number_of_towns.unknown_population += 1;
        }
        if (row.out_of_date) {
            metrics.summary.number_of_towns.out_of_date += 1;
        }

        const livingConditionsStatuses = getLivingConditionsStatuses(row);

        // on incrémente la donnée commune
        hashCities[row.city_code].summary.number_of_towns += 1;
        if (row.population_total !== null) {
            hashCities[row.city_code].summary.number_of_persons += row.population_total;
        }
        if (row.population_couples !== null) {
            hashCities[row.city_code].summary.number_of_households += row.population_couples;
            metrics.summary.number_of_households += row.population_couples;
        }
        if (row.population_minors !== null) {
            hashCities[row.city_code].summary.number_of_minors += row.population_minors;
            metrics.summary.number_of_minors += row.population_minors;
        }
        if (row.minors_in_school !== null) {
            hashCities[row.city_code].summary.number_of_schooled_minors += row.minors_in_school;
            metrics.summary.number_of_schooled_minors += row.minors_in_school;
        }
        if (livingConditionsStatuses.water.status === 'good') {
            hashCities[row.city_code].summary.number_of_towns_with_water += 1;
            hashCities[row.city_code].summary.number_of_inhabitants_with_water += row.population_total;
            metrics.summary.number_of_towns_with_water += 1;
        }

        if (livingConditionsStatuses.electricity.status === 'good') {
            hashCities[row.city_code].summary.number_of_towns_with_electricity += 1;
            hashCities[row.city_code].summary.number_of_inhabitants_with_electricity += row.population_total;
            metrics.summary.number_of_towns_with_electricity += 1;
        }
        if (livingConditionsStatuses.trash.status === 'good') {
            hashCities[row.city_code].summary.number_of_towns_with_trash_evacuation += 1;
            hashCities[row.city_code].summary.number_of_inhabitants_with_trash_evacuation += row.population_total;
            metrics.summary.number_of_towns_with_trash_evacuation += 1;
        }
        if (livingConditionsStatuses.fire_prevention.status === 'good') {
            hashCities[row.city_code].summary.number_of_towns_with_fire_prevention += 1;
            hashCities[row.city_code].summary.number_of_inhabitants_with_fire_prevention += row.population_total;
            metrics.summary.number_of_towns_with_fire_prevention += 1;
        }
        if (livingConditionsStatuses.sanitary.status === 'good') {
            hashCities[row.city_code].summary.number_of_towns_with_toilets += 1;
            hashCities[row.city_code].summary.number_of_inhabitants_with_toilets += row.population_total;
            metrics.summary.number_of_towns_with_toilets += 1;
        }
        if (livingConditionsStatuses.pest_animals.status === 'good') {
            hashCities[row.city_code].summary.number_of_towns_without_pest_animals += 1;
            hashCities[row.city_code].summary.number_of_inhabitants_without_pest_animals += row.population_total;
            metrics.summary.number_of_towns_without_pest_animals += 1;
        }

        if (row.heatwave_status === true) {
            hashCities[row.city_code].summary.number_of_towns_with_heatwave += 1;
            hashCities[row.city_code].summary.number_of_inhabitants_with_heatwave += row.population_total;
            metrics.summary.number_of_towns_with_heatwave += 1;
        }


        if (hasJusticePermission) {
            if (row.owner_complaint === true) {
                hashCities[row.city_code].summary.number_of_towns_with_owner_complaint += 1;
                metrics.summary.number_of_towns_with_owner_complaint += 1;
            }
            if (row.justice_procedure === true) {
                hashCities[row.city_code].summary.number_of_towns_with_justice_procedure += 1;
                metrics.summary.number_of_towns_with_justice_procedure += 1;
            }
            if (row.police_status === 'granted') {
                hashCities[row.city_code].summary.number_of_towns_with_police += 1;
                metrics.summary.number_of_towns_with_police += 1;
            }
        }

        // on ajoute la donnée du site
        const town:ShantytownMetrics = {
            latitude: row.latitude,
            longitude: row.longitude,
            id: row.shantytown_id,
            usename: getUsenameOf({ ...row, addressSimple: getAddressSimpleOf(row.address) }),
            field_type: row.field_type,
            number_of_persons: row.population_total,
            number_of_households: row.population_couples,
            number_of_minors: row.population_minors,
            number_of_schooled_minors: row.minors_in_school,
            access_to_water: livingConditionsStatuses.water.status,
            access_to_electricity: livingConditionsStatuses.electricity.status,
            trash_evacuation: livingConditionsStatuses.trash.status,
            fire_prevention: livingConditionsStatuses.fire_prevention.status,
            working_toilets: livingConditionsStatuses.sanitary.status,
            absence_of_pest_animals: livingConditionsStatuses.pest_animals.status,
            heatwave: row.heatwave_status,
            owner_complaint: null,
            justice_procedure: null,
            police: null,
            origins: row.origins,
        };

        if (hasJusticePermission) {
            town.justice_procedure = row.justice_procedure;
            town.owner_complaint = row.owner_complaint;
            if (row.police_status === 'granted') {
                town.police = true;
            } else if (row.police_status === null) {
                town.police = null;
            } else {
                town.police = false;
            }
        }

        hashCities[row.city_code].towns.push(town);
    });


    // metrics.cities = Object.values(hashCities).map(cityMetric => ({
    //     ...cityMetric,
    //     summary: {
    //         ...cityMetric.summary,
    //         percentage_of_towns_with_water: Math.round((cityMetric.summary.number_of_towns_with_water * 100) / cityMetric.summary.number_of_towns),
    //         percentage_of_towns_with_electricity: Math.round((cityMetric.summary.number_of_towns_with_electricity * 100) / cityMetric.summary.number_of_towns),
    //         percentage_of_towns_with_trash_evacuation: Math.round((cityMetric.summary.number_of_towns_with_trash_evacuation * 100) / cityMetric.summary.number_of_towns),
    //         percentage_of_towns_with_fire_prevention: Math.round((cityMetric.summary.number_of_towns_with_fire_prevention * 100) / cityMetric.summary.number_of_towns),
    //         percentage_of_towns_with_toilets: Math.round((cityMetric.summary.number_of_towns_with_toilets * 100) / cityMetric.summary.number_of_towns),
    //         percentage_of_towns_without_pest_animals: Math.round((cityMetric.summary.number_of_towns_without_pest_animals * 100) / cityMetric.summary.number_of_towns),
    //         percentage_of_towns_with_heatwave: Math.round((cityMetric.summary.number_of_towns_with_heatwave * 100) / cityMetric.summary.number_of_towns),
    //         percentage_of_towns_with_owner_complaint: Math.round((cityMetric.summary.number_of_towns_with_owner_complaint * 100) / cityMetric.summary.number_of_towns),
    //         percentage_of_towns_with_justice_procedure: Math.round((cityMetric.summary.number_of_towns_with_justice_procedure * 100) / cityMetric.summary.number_of_towns),
    //         percentage_of_towns_with_police: Math.round((cityMetric.summary.number_of_towns_with_police * 100) / cityMetric.summary.number_of_towns),
    //         percentage_of_inhabitants_with_water: Math.round((cityMetric.summary.number_of_inhabitants_with_water * 100) / cityMetric.summary.number_of_persons),
    //         percentage_of_inhabitants_with_electricity: Math.round((cityMetric.summary.number_of_inhabitants_with_electricity * 100) / cityMetric.summary.number_of_persons),
    //         percentage_of_inhabitants_with_trash_evacuation: Math.round((cityMetric.summary.number_of_inhabitants_with_trash_evacuation * 100) / cityMetric.summary.number_of_persons),
    //         percentage_of_inhabitants_with_fire_prevention: Math.round((cityMetric.summary.number_of_inhabitants_with_fire_prevention * 100) / cityMetric.summary.number_of_persons),
    //         percentage_of_inhabitants_with_toilets: Math.round((cityMetric.summary.number_of_inhabitants_with_toilets * 100) / cityMetric.summary.number_of_persons),
    //         percentage_of_inhabitants_without_pest_animals: Math.round((cityMetric.summary.number_of_inhabitants_without_pest_animals * 100) / cityMetric.summary.number_of_persons),
    //         percentage_of_inhabitants_with_heatwave: Math.round((cityMetric.summary.number_of_inhabitants_with_heatwave * 100) / cityMetric.summary.number_of_persons),
    //         percentage_of_schooled_minors: Math.round((cityMetric.summary.number_of_schooled_minors * 100) / cityMetric.summary.number_of_minors),
    //     },

    // }));

    return metrics;
};
