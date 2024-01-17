export type Nation = {
    type: 'nation',
    region: null,
    departement: null,
    epci: null,
    city: null
};

export type Region = {
    type: 'region',
    region: {
        code: string,
        name: string,
    },
    departement: null,
    epci: null,
    city: null
};

export type Departement = {
    type: 'departement',
    region: {
        code: string,
        name: string,
    },
    departement: {
        code: string,
        name: string,
    },
    epci: null,
    city: null
};

export type EPCI = {
    type: 'epci',
    region: {
        code: string,
        name: string,
    },
    departement: {
        code: string,
        name: string,
    },
    epci: {
        code: string,
        name: string,
    },
    city: null
};

export type City = {
    type: 'city',
    region: {
        code: string,
        name: string,
    },
    departement: {
        code: string,
        name: string,
    },
    epci: {
        code: string,
        name: string,
    },
    city: {
        code: string,
        name: string,
        main: string | null
    }
};

export type Location = Nation | Region | Departement | EPCI | City;
export type InterventionArea = Location & {
    latitude: number;
    longitude: number;
    is_main_area: boolean;
};
