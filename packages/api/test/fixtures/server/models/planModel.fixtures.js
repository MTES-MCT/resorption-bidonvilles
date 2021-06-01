const date = new Date('1987-08-11T00:00:00');
const randomStr = global.generate('string');
const commonInputs = require('#fixtures/common.fixtures')(randomStr);

module.exports = {
    findAll: {
        inputs: [
            ...commonInputs,
            {
                table: 'plans',
                rows: [
                    {
                        name: null,
                        started_at: date,
                        ended_at: null,
                        fk_type: 1,
                        fk_departement: 75,
                        targeted_on_towns: true,
                        created_by: 1,
                        updated_by: 1,
                    },
                    {
                        name: randomStr,
                        started_at: date,
                        ended_at: date,
                        fk_type: 1,
                        fk_departement: 75,
                        targeted_on_towns: false,
                        created_by: 1,
                        updated_by: 1,
                    },
                ],
            },
        ],
        output: [
            {
                id: 1,
                startedAt: date.getTime() / 1000,
                endedAt: null,
                targetedOnTowns: true,
                name: null,
                createdBy: 1,
                updatedBy: 1,
                type: {
                    id: 1,
                    label: 'Inconnu',
                },
                towns: [],
                details: null,
                departement: {
                    id: '75',
                    name: 'Paris',
                },
            },
            {
                id: 2,
                startedAt: date.getTime() / 1000,
                endedAt: date.getTime() / 1000,
                targetedOnTowns: false,
                name: randomStr,
                createdBy: 1,
                updatedBy: 1,
                type: {
                    id: 1,
                    label: 'Inconnu',
                },
                towns: [],
                details: null,
                departement: {
                    id: '75',
                    name: 'Paris',
                },
            },
        ],
    },

    create: [
        {
            inputs: commonInputs,
            newInput: {
                name: null,
                startedAt: date,
                targetedOnTowns: false,
                type: 1,
                departement: '75',
                createdBy: 1,
            },
            output: {
                started_at: date,
                ended_at: null,
                targeted_on_towns: false,
                fk_type: 1,
                fk_departement: '75',
            },
        },
        {
            inputs: commonInputs,
            newInput: {
                name: null,
                startedAt: date,
                targetedOnTowns: true,
                type: 1,
                departement: '75',
                createdBy: 1,
            },
            output: {
                started_at: date,
                ended_at: null,
                targeted_on_towns: true,
                fk_type: 1,
                fk_departement: '75',
            },
        },
    ],
};
