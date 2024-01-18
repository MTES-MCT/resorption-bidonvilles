type PermissionRegion = {
    type: 'region',
    region: { code: string, name: string },
    departement: null,
    epci: null,
    city: null,
};
type PermissionDepartement = {
    type: 'departement',
    region: { code: string, name: string },
    departement: { code: string, name: string },
    epci: null,
    city: null,
};
type PermissionEpci = {
    type: 'epci',
    region: { code: string, name: string },
    departement: { code: string, name: string },
    epci: { code: string, name: string },
    city: null,
};
type PermissionCity = {
    type: 'city',
    region: { code: string, name: string },
    departement: { code: string, name: string },
    epci: { code: string, name: string },
    city: { code: string, name: string, main: string | null },
};

export interface Permission {
    allowed: boolean,
    allowed_on_national: boolean,
    allowed_on: null | {
        regions: PermissionRegion[],
        departements: PermissionDepartement[],
        epci: PermissionEpci[],
        cities: PermissionCity[],
        actions: number[],
    },
}
