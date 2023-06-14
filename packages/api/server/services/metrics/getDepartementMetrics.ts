import metricsModel from '#server/models/metricsModel';
import departementModel from '#server/models/departementModel';
import regionModel from '#server/models/regionModel';
import ServiceError from '#server/errors/ServiceError';
import { DepartementMetricsRawData } from '#server/models/metricsModel/getDepartementData';
import getAddressSimpleOf from '#server/models/shantytownModel/_common/getAddressSimpleOf';
import getUsenameOf from '#server/models/shantytownModel/_common/getUsenameOf';
import { DepartementRawData } from '#server/models/departementModel/findOne';
import { RegionRawData } from '#server/models/regionModel/findOne';
import { CityMetrics, DepartementMetrics, ShantytownMetrics } from '#root/types/resources/DepartementMetrics.d';

type CityMetricsObject = {
    [key: string]: CityMetrics;
};
export default async (user, departementCode):Promise<DepartementMetrics> => {
    let data:DepartementMetricsRawData[];

    try {
        data = await metricsModel.getDepartementData(user, departementCode);
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }

    let departement: DepartementRawData;
    let region: RegionRawData;
    try {
        departement = await departementModel.findOne(departementCode);
        region = await regionModel.findOne(departement.region);
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }
    const metrics: DepartementMetrics = {
        summary: {
            number_of_towns: {
                all: data.length,
                eu_only: 0,
                unknown_population: 0,
                out_of_date: 0,
            },
            number_of_persons: {
                all: 0,
                eu_only: 0,
            },
        },
        departement: {
            name: departement.name,
            code: departement.code,
            latitude: departement.latitude,
            longitude: departement.longitude,
            chieftown: { latitude: departement.chief_town_latitude, longitude: departement.chief_town_longitude },
        },
        region: {
            name: region.name,
            code: region.code,
            latitude: region.latitude,
            longitude: region.longitude,
            chieftown: { latitude: region.chief_town_latitude, longitude: region.chief_town_longitude },
        },
        cities: [],
    };
    const hashCities:CityMetricsObject = {};

    data.forEach((row) => {
        // on crée la donnée commune si elle n'existe pas
        if (!hashCities[row.city_code]) {
            hashCities[row.city_code] = {
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
        // on ajoute la donée du site
        const town:ShantytownMetrics = {
            latitude: row.latitude,
            longitude: row.longitude,
            id: row.shantytown_id,
            usename: getUsenameOf({ ...row, addressSimple: getAddressSimpleOf(row.address) }),
            field_type: row.field_type,
            number_of_persons: row.population_total,
            number_of_households: row.population_couples,
            number_of_minors: row.population_minors,
            access_to_water: row.access_to_water,
            access_to_electricity: row.access_to_electricity,
            trash_evacuation: row.trash_evacuation,
            fire_prevention: row.fire_prevention,
            toilets: row.toilets,
            absence_of_pest_animals: row.absence_of_pest_animals,
            owner_complaint: row.owner_complaint,
            justice_procedure: row.justice_procedure,
            police: row.police_status,
            origins: row.origins,
        };

        hashCities[row.city_code].towns.push(town);
    });

    metrics.cities = Object.values(hashCities);
    return metrics;
};
