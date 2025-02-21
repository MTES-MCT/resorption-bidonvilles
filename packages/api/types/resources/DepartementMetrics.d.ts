import { StatusEnum } from '#server/models/shantytownModel/_common/livingConditions/LivingConditions.d';
import { DepartementWithCoordinates } from './Departement.d';
import { RegionWithCoordinates } from './Region.d';

export type Origin = 'french' | 'european' | 'other';

export type ShantytownMetrics = {
    latitude: number,
    longitude: number,
    id:number,
    usename: string,
    field_type: string,
    number_of_persons: number | null,
    number_of_households: number | null,
    number_of_minors: number | null,
    number_of_schooled_minors: number | null,
    access_to_water: StatusEnum,
    access_to_electricity: StatusEnum,
    trash_evacuation: StatusEnum,
    fire_prevention: StatusEnum,
    working_toilets: StatusEnum,
    absence_of_pest_animals: StatusEnum,
    heatwave: boolean | null,
    owner_complaint: boolean | null,
    justice_procedure: boolean | null,
    police: boolean | null,
    origins: Origin[],
};

export type CityMetrics = {
    summary: {
        number_of_towns: number,
        number_of_persons: number | null,
        number_of_households: number | null,
        number_of_minors: number | null,
        number_of_schooled_minors: number | null,
        number_of_towns_with_water: number,
        number_of_towns_with_electricity: number,
        number_of_towns_with_trash_evacuation: number,
        number_of_towns_with_fire_prevention: number,
        number_of_towns_with_toilets: number,
        number_of_towns_without_pest_animals: number,
        number_of_towns_with_heatwave: number,
        number_of_towns_with_owner_complaint: number,
        number_of_towns_with_justice_procedure: number,
        number_of_towns_with_police: number,
        percentage_of_towns_with_water: number,
        percentage_of_towns_with_electricity: number,
        percentage_of_towns_with_trash_evacuation: number,
        percentage_of_towns_with_fire_prevention: number,
        percentage_of_towns_with_toilets: number,
        percentage_of_towns_without_pest_animals: number,
        percentage_of_towns_with_heatwave: number,
        percentage_of_towns_with_owner_complaint: number,
        percentage_of_towns_with_justice_procedure: number,
        percentage_of_towns_with_police: number,
        number_of_inhabitants_with_water: number,
        number_of_inhabitants_with_electricity: number,
        number_of_inhabitants_with_trash_evacuation: number,
        number_of_inhabitants_with_fire_prevention: number,
        number_of_inhabitants_with_toilets: number,
        number_of_inhabitants_without_pest_animals: number,
        number_of_inhabitants_with_heatwave: number,
        percentage_of_inhabitants_with_water: number,
        percentage_of_inhabitants_with_electricity: number,
        percentage_of_inhabitants_with_trash_evacuation: number,
        percentage_of_inhabitants_with_fire_prevention: number,
        percentage_of_inhabitants_with_toilets: number,
        percentage_of_inhabitants_without_pest_animals: number,
        percentage_of_inhabitants_with_heatwave: number,

    }
    city: {
        name: string,
        code: string,
        latitude: number,
        longitude: number
    }
    towns: ShantytownMetrics[]
};

export type DepartementMetrics = {
    summary: {
        number_of_towns: {
            all: number,
            eu_only: number,
            unknown_population: number,
            out_of_date: number,
        },
        number_of_persons: {
            all: number,
            eu_only: number,
        },

        number_of_households: number | null,
        number_of_minors: number | null,
        number_of_schooled_minors: number | null,
        number_of_towns_with_water: number,
        number_of_towns_with_electricity: number,
        number_of_towns_with_trash_evacuation: number,
        number_of_towns_with_fire_prevention: number,
        number_of_towns_with_toilets: number,
        number_of_towns_without_pest_animals: number,
        number_of_towns_with_heatwave: number,
        number_of_towns_with_owner_complaint: number,
        number_of_towns_with_justice_procedure: number,
        number_of_towns_with_police: number,
    },
    departement: DepartementWithCoordinates,
    region: RegionWithCoordinates,
    cities: CityMetrics[]
};
