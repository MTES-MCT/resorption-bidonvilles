const builtDate = new Date('1987-08-11T00:00:00');
const closedDate = new Date('1989-10-25T00:00:00');
const randomStr = global.generate('string');
const commonInputs = require('#fixtures/common.fixtures')(randomStr);

function getEmptyTownInput(withDistrict = false) {
    return {
        // shantytown_id: '', (auto)
        status: 'open',
        built_at: null,
        closed_at: null,
        latitude: 2.5,
        longitude: 1.0,
        address: randomStr,
        address_details: null,
        fk_city: withDistrict ? '75001' : '75056',
        owner: null,
        declared_at: null,
        census_status: null,
        census_conducted_at: null,
        census_conducted_by: null,
        fk_field_type: 1,
        fk_owner_type: 1,
        population_total: null,
        population_couples: null,
        population_minors: null,
        fk_electricity_type: 1,
        access_to_water: null,
        trash_evacuation: null,
        owner_complaint: null,
        justice_procedure: null,
        justice_rendered: null,
        justice_rendered_at: null,
        justice_rendered_by: null,
        justice_challenged: null,
        police_status: null,
        police_requested_at: null,
        police_granted_at: null,
        bailiff: null,
        // created_at: '', (default value)
        created_by: 1,
        updated_at: closedDate,
        // updated_by: '', (not updated)
    };
}

function getFullTownInput(withDistrict = false) {
    return Object.assign({}, getEmptyTownInput(withDistrict), {
        status: 'closed_by_justice',
        built_at: builtDate,
        closed_at: closedDate,
        address_details: randomStr,
        population_total: 2018,
        population_couples: 10,
        population_minors: 8,
        fk_electricity_type: 1,
        access_to_water: true,
        trash_evacuation: true,
        owner: 'Anis Safine Laget',
        declared_at: builtDate,
        census_status: 'done',
        census_conducted_by: 'MdM',
        census_conducted_at: builtDate,
        owner_complaint: true,
        justice_procedure: true,
        justice_rendered: true,
        justice_rendered_at: closedDate,
        justice_rendered_by: 'TGI de Nanterre',
        justice_challenged: true,
        police_status: 'granted',
        police_requested_at: builtDate,
        police_granted_at: closedDate,
        bailiff: 'Cabinet H',
    });
}

function getOriginsFor(townId) {
    return [
        {
            fk_shantytown: townId,
            fk_social_origin: 1,
        },
        {
            fk_shantytown: townId,
            fk_social_origin: 2,
        },
    ];
}

function getCommentsFor(townId) {
    return [
        {
            fk_shantytown: townId,
            description: 'Comment 1',
            created_at: builtDate,
            created_by: 1,
        },
        {
            fk_shantytown: townId,
            description: 'Comment 2',
            created_at: builtDate,
            created_by: 1,
        },
    ];
}

function getSolutionsFor(townId) {
    return [
        {
            fk_shantytown: townId,
            fk_closing_solution: 1,
            number_of_people_affected: null,
            number_of_households_affected: null,
        },
        {
            fk_shantytown: townId,
            fK_closing_solution: 2,
            number_of_people_affected: 25,
            number_of_households_affected: 10,
        },
    ];
}

function getEmptyTownOutput(townId, version = 'unfiltered', withDistrict = false) {
    const baseOutput = {
        id: townId,
        status: 'open',
        latitude: 2.5,
        longitude: 1.0,
        city: withDistrict
            ? {
                code: '75001',
                name: 'Paris (1er arrondissement)',
                main: '75056',
            }
            : {
                code: '75056',
                name: 'Paris',
                main: null,
            },
        epci: {
            code: '200054781',
            name: 'Métropole du Grand Paris',
        },
        departement: {
            code: '75',
            name: 'Paris',
        },
    };

    if (version === 'filtered') {
        return baseOutput;
    }

    return Object.assign(baseOutput, {
        declaredAt: null,
        builtAt: null,
        closedAt: null,
        address: randomStr,
        addressDetails: null,
        populationTotal: null,
        populationCouples: null,
        populationMinors: null,
        electricityType: {
            id: 1,
            label: 'Inconnu',
        },
        accessToWater: null,
        trashEvacuation: null,
        owner: null,
        censusStatus: null,
        censusConductedBy: null,
        censusConductedAt: null,
        ownerComplaint: null,
        justiceProcedure: null,
        justiceRendered: null,
        justiceRenderedAt: null,
        justiceRenderedBy: null,
        justiceChallenged: null,
        policeStatus: null,
        policeRequestedAt: null,
        policeGrantedAt: null,
        bailiff: null,
        socialOrigins: [],
        comments: [],
        closingSolutions: [],
        fieldType: {
            id: 1,
            label: 'Inconnu',
        },
        ownerType: {
            id: 1,
            label: 'Inconnu',
        },
        updatedAt: closedDate.getTime() / 1000,
    });
}

function getFullTownOutput(townId, version = 'unfiltered', withDistrict = false) {
    const baseOutput = {
        id: townId,
        status: 'closed_by_justice',
        latitude: 2.5,
        longitude: 1.0,
        city: withDistrict
            ? {
                code: '75001',
                name: 'Paris (1er arrondissement)',
                main: '75056',
            }
            : {
                code: '75056',
                name: 'Paris',
                main: null,
            },
        epci: {
            code: '200054781',
            name: 'Métropole du Grand Paris',
        },
        departement: {
            code: '75',
            name: 'Paris',
        },
    };

    if (version === 'filtered') {
        return baseOutput;
    }

    return Object.assign({}, getEmptyTownOutput(townId, 'unfiltered', withDistrict), {
        status: 'closed_by_justice',
        declaredAt: builtDate.getTime() / 1000,
        builtAt: builtDate.getTime() / 1000,
        closedAt: closedDate.getTime() / 1000,
        addressDetails: randomStr,
        populationTotal: 2018,
        populationCouples: 10,
        populationMinors: 8,
        electricityType: {
            id: 1,
            label: 'Inconnu',
        },
        accessToWater: true,
        trashEvacuation: true,
        owner: 'Anis Safine Laget',
        censusStatus: 'done',
        censusConductedBy: 'MdM',
        censusConductedAt: builtDate.getTime() / 1000,
        ownerComplaint: true,
        justiceProcedure: true,
        justiceRendered: true,
        justiceRenderedAt: closedDate.getTime() / 1000,
        justiceRenderedBy: 'TGI de Nanterre',
        justiceChallenged: true,
        policeStatus: 'granted',
        policeRequestedAt: builtDate.getTime() / 1000,
        policeGrantedAt: closedDate.getTime() / 1000,
        bailiff: 'Cabinet H',
        socialOrigins: [
            { id: 1, label: 'Ressortissants français' },
            { id: 2, label: 'Ressortissants européens' },
        ],
        comments: [
            {
                id: 2,
                description: 'Comment 2',
                createdAt: builtDate.getTime() / 1000,
                createdBy: {
                    id: 1,
                    company: randomStr,
                    firstName: randomStr,
                    lastName: randomStr,
                },
            },
            {
                id: 1,
                description: 'Comment 1',
                createdAt: builtDate.getTime() / 1000,
                createdBy: {
                    id: 1,
                    company: randomStr,
                    firstName: randomStr,
                    lastName: randomStr,
                },
            },
        ],
        closingSolutions: [
            { id: 1, peopleAffected: null, householdsAffected: null },
            { id: 2, peopleAffected: 25, householdsAffected: 10 },
        ],
    });
}

module.exports = {
    findAll: {
        inputs: [
            ...commonInputs,
            {
                table: 'shantytowns',
                rows: [
                    getEmptyTownInput(),
                    getFullTownInput(),
                    getEmptyTownInput(true),
                ],
            },
            {
                table: 'shantytown_origins',
                rows: [
                    ...getOriginsFor(2),
                ],
            },
            {
                table: 'shantytown_comments',
                rows: [
                    ...getCommentsFor(2),
                ],
            },
            {
                table: 'shantytown_closing_solutions',
                rows: [
                    ...getSolutionsFor(2),
                ],
            },
        ],
        outputWithAllPermissions: [
            getEmptyTownOutput(1),
            getFullTownOutput(2),
            getEmptyTownOutput(3, 'unfiltered', true),
        ],
        outputWithNoPermissions: [
            getEmptyTownOutput(1, 'filtered'),
            getFullTownOutput(2, 'filtered'),
            getEmptyTownOutput(3, 'filtered', true),
        ],
    },

    findOne: {
        inputs: [
            ...commonInputs,
            {
                table: 'shantytowns',
                rows: [
                    getFullTownInput(),
                ],
            },
            {
                table: 'shantytown_origins',
                rows: [
                    ...getOriginsFor(1),
                ],
            },
            {
                table: 'shantytown_comments',
                rows: [
                    ...getCommentsFor(1),
                ],
            },
            {
                table: 'shantytown_closing_solutions',
                rows: [
                    ...getSolutionsFor(1),
                ],
            },
        ],
        outputWithAllPermissions: getFullTownOutput(1),
        outputWithNoPermissions: getFullTownOutput(1, 'filtered'),
    },
};
