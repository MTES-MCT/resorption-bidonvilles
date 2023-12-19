import {
 City, Departement, EPCI, Nation, Region 
} from '#server/models/geoModel/Location.d';

export default {
    nation(): Nation {
        return {
            type: 'nation',
            region: null,
            departement: null,
            epci: null,
            city: null,
        };
    },
    paris: {
        region(): Region {
            return {
                type: 'region',
                region: {
                    code: '11',
                    name: 'Île-de-France',
                },
                departement: null,
                epci: null,
                city: null,
            };
        },
        departement(): Departement {
            return {
                type: 'departement',
                region: {
                    code: '11',
                    name: 'Île-de-France',
                },
                departement: {
                    code: '75',
                    name: 'Paris',
                },
                epci: null,
                city: null,
            };
        },
        epci(): EPCI {
            return {
                type: 'epci',
                region: {
                    code: '11',
                    name: 'Île-de-France',
                },
                departement: {
                    code: '75',
                    name: 'Paris',
                },
                epci: {
                    code: '200054781',
                    name: 'Métropole du Grand Paris',
                },
                city: null,
            };
        },
        city(): City {
            return {
                type: 'city',
                region: {
                    code: '11',
                    name: 'Île-de-France',
                },
                departement: {
                    code: '75',
                    name: 'Paris',
                },
                epci: {
                    code: '200054781',
                    name: 'Métropole du Grand Paris',
                },
                city: {
                    code: '75056',
                    name: 'Paris',
                    main: null,
                },
            };
        },
        district(): City {
            return {
                type: 'city',
                region: {
                    code: '11',
                    name: 'Île-de-France',
                },
                departement: {
                    code: '75',
                    name: 'Paris',
                },
                epci: {
                    code: '200054781',
                    name: 'Métropole du Grand Paris',
                },
                city: {
                    code: '75101',
                    name: 'Paris 1er Arrondissement',
                    main: '75056',
                },
            };
        },
    },
    marseille: {
        region(): Region {
            return {
                type: 'region',
                region: {
                    code: '93',
                    name: 'Provence-Alpes-Côte d\'Azur',
                },
                departement: null,
                epci: null,
                city: null,
            };
        },
        departement(): Departement {
            return {
                type: 'departement',
                region: {
                    code: '93',
                    name: 'Provence-Alpes-Côte d\'Azur',
                },
                departement: {
                    code: '13',
                    name: 'Bouches-du-Rhône',
                },
                epci: null,
                city: null,
            };
        },
        epci(): EPCI {
            return {
                type: 'epci',
                region: {
                    code: '93',
                    name: 'Provence-Alpes-Côte d\'Azur',
                },
                departement: {
                    code: '13',
                    name: 'Bouches-du-Rhône',
                },
                epci: {
                    code: '200054807',
                    name: 'Métropole d\'Aix-Marseille-Provence',
                },
                city: null,
            };
        },
        city(): City {
            return {
                type: 'city',
                region: {
                    code: '93',
                    name: 'Provence-Alpes-Côte d\'Azur',
                },
                departement: {
                    code: '13',
                    name: 'Bouches-du-Rhône',
                },
                epci: {
                    code: '200054807',
                    name: 'Métropole d\'Aix-Marseille-Provence',
                },
                city: {
                    code: '13201',
                    name: 'Marseille',
                    main: null,
                },
            };
        },
        district(): City {
            return {
                type: 'city',
                region: {
                    code: '93',
                    name: 'Provence-Alpes-Côte d\'Azur',
                },
                departement: {
                    code: '13',
                    name: 'Bouches-du-Rhône',
                },
                epci: {
                    code: '200054807',
                    name: 'Métropole d\'Aix-Marseille-Provence',
                },
                city: {
                    code: '13201',
                    name: 'Marseille 1er Arrondissement',
                    main: '13055',
                },
            };
        },
    },
};
