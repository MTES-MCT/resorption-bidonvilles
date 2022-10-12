module.exports = {
    nation() {
        return {
            type: 'nation',
            region: null,
            departement: null,
            epci: null,
            city: null,
        };
    },
    paris: {
        region() {
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
        departement() {
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
        epci() {
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
        city() {
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
                },
            };
        },
        district() {
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
        region() {
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
        departement() {
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
        epci() {
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
        city() {
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
                },
            };
        },
        district() {
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
