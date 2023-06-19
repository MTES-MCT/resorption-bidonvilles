import { StatusEnum } from '#server/models/shantytownModel/_common/livingConditions/LivingConditions.d';

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
    access_to_water: StatusEnum,
    access_to_electricity: StatusEnum,
    trash_evacuation: StatusEnum,
    fire_prevention: StatusEnum,
    working_toilets: StatusEnum,
    absence_of_pest_animals: StatusEnum,
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
        number_of_towns_with_water: number,
        number_of_towns_with_electricity: number,
        number_of_towns_with_trash_evacuation: number,
        number_of_towns_with_fire_prevention: number,
        number_of_towns_with_working_toilets: number,
        number_of_towns_with_absence_of_pest_animals: number,
        number_of_towns_with_owner_complaint: number,
        number_of_towns_with_justice_procedure: number,
        number_of_towns_with_police: number,

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
    },
    departement: {
        name: string,
        code: string,
        latitude: number,
        longitude: number,
        chieftown: { latitude: number, longitude: number }
    },
    region: {
        name: string,
        code: string,
        latitude: number,
        longitude: number,
        chieftown: { latitude: number, longitude: number }
    },
    cities: CityMetrics[]
};
