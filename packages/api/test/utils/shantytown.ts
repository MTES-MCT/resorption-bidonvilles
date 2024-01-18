import { City } from '#server/models/geoModel/Location.d';
import { Shantytown } from '#root/types/resources/Shantytown.d';
import locations from './location';
import fakeUser from './user';

const defaultLocation = locations.paris.city();

export function serialized(location: City = defaultLocation, override = {}): Shantytown {
    const {
        city, epci, departement, region,
    } = location;

    const shantytown: Shantytown = {
        type: 'shantytown',
        id: 1,
        city: {
            ...city,
            latitude: 0,
            longitude: 1,
        },
        epci,
        departement: {
            ...departement,
            latitude: 0,
            longitude: 1,
            chieftown: {
                code: '10',
                name: '10',
                latitude: 0,
                longitude: 1,
            },
        },
        region: {
            ...region,
            latitude: 0,
            longitude: 1,
            chieftown: {
                code: '10',
                name: '10',
                latitude: 0,
                longitude: 1,
            },
        },
        name: null,
        status: 'open',
        closingContext: null,
        latitude: 1,
        longitude: 0,
        declaredAt: null,
        builtAt: Date.now(),
        isReinstallation: false,
        reinstallationComments: null,
        reinstallationIncomingTowns: [],
        closedAt: null,
        address: 'adresse',
        addressDetails: null,
        addressSimple: 'Adresse',
        usename: 'Nom',
        populationTotal: null,
        populationCouples: null,
        populationMinors: null,
        populationMinors0To3: null,
        populationMinors3To6: null,
        populationMinors6To12: null,
        populationMinors12To16: null,
        populationMinors16To18: null,
        minorsInSchool: null,
        caravans: null,
        huts: null,
        tents: null,
        cars: null,
        mattresses: null,
        livingConditions: {
            version: 2,
            electricity: {
                status: {
                    status: 'unknown',
                    positive: [],
                    negative: [],
                    unknown: ['access', 'acces_types', 'access_is_unequal'],
                },
                access: null,
                access_types: [],
                access_is_unequal: null,
            },
            water: {
                status: {
                    status: 'unknown',
                    positive: [],
                    negative: [],
                    unknown: [
                        'access_type',
                        'access_type_details',
                        'access_is_public',
                        'access_is_continuous',
                        'access_is_continuous_details',
                        'access_is_local',
                        'access_is_close',
                        'access_is_unequal',
                        'access_is_unequal_details',
                        'access_has_stagnant_water',
                        'access_comments',
                    ],
                },
                access_type: null,
                access_type_details: null,
                access_is_public: null,
                access_is_continuous: null,
                access_is_continuous_details: null,
                access_is_local: null,
                access_is_close: null,
                access_is_unequal: null,
                access_is_unequal_details: null,
                access_has_stagnant_water: null,
                access_comments: null,
            },
            trash: {
                status: {
                    status: 'unknown',
                    positive: [],
                    negative: [],
                    unknown: [
                        'is_piling',
                        'evacuation_is_close',
                        'evacuation_is_safe',
                        'evacuation_is_regular',
                        'bulky_is_piling',
                    ],
                },
                is_piling: null,
                evacuation_is_close: null,
                evacuation_is_safe: null,
                evacuation_is_regular: null,
                bulky_is_piling: null,
            },
            sanitary: {
                status: {
                    status: 'unknown',
                    positive: [],
                    negative: [],
                    unknown: [
                        'open_air_defecation',
                        'working_toilets',
                        'toilet_types',
                        'toilets_are_inside',
                        'toilets_are_lighted',
                        'hand_washing',
                    ],
                },
                open_air_defecation: null,
                working_toilets: null,
                toilet_types: [],
                toilets_are_inside: null,
                toilets_are_lighted: null,
                hand_washing: null,
            },
            pest_animals: {
                status: {
                    status: 'unknown',
                    positive: [],
                    negative: [],
                    unknown: ['presence', 'details'],
                },
                presence: null,
                details: null,
            },
            fire_prevention: {
                status: {
                    status: 'unknown',
                    positive: [],
                    negative: [],
                    unknown: ['diagnostic'],
                },
                diagnostic: null,
            },
        },
        censusStatus: 'none',
        censusConductedBy: null,
        censusConductedAt: null,
        fieldType: {
            id: 1,
            label: 'Inconnu',
        },
        ownerType: {
            id: 1,
            label: 'Inconnu',
        },
        socialOrigins: [],
        comments: {
            regular: [],
            covid: [],
        },
        actors: [],
        actions: [],
        closingSolutions: [],
        closedWithSolutions: null,
        changelog: [],
        createdAt: Date.now(),
        updatedAt: null,
        createdBy: fakeUser(),
        updatedBy: fakeUser(),
        heatwaveStatus: false,
        resorptionTarget: null,
        completionRate: 0.5,
        distance: null,
    };

    return {
        ...shantytown,
        ...override,
    };
}

export default serialized;
