
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
    access_to_water: boolean,
    access_to_electricity: boolean,
    trash_evacuation: boolean,
    fire_prevention: boolean,
    toilets: boolean,
    absence_of_pest_animals: boolean,
    owner_complaint: boolean | null,
    justice_procedure: boolean | null,
    police: boolean | null,
    origins: Origin[],
};

export type CityMetrics = {
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
