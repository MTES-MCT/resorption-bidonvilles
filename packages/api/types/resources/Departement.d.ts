export type Departement = {
    code: string;
    name: string;
    region: string;
};

export type DepartementWithCoordinates = Departement & {
    latitude: number;
    longitude: number;
    chieftown: {
        latitude: number;
        longitude: number;
    },
};
