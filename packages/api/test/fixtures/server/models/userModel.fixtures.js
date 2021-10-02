const randomStr = global.generate('string');
const commonInputs = require('#fixtures/common.fixtures')(randomStr);

module.exports = {
    findAll: {
        inputs: [
            ...commonInputs,
            {
                table: 'users',
                rows: [
                    {
                        email: `${randomStr}2`,
                        password: null,
                        salt: randomStr,
                        fk_departement: '75',
                        first_name: randomStr,
                        last_name: randomStr,
                        company: randomStr,
                        fk_role: 2,
                        active: false,
                    },
                ],
            },
        ],
        output: [
            {
                id: 1,
                email: randomStr,
                departement: '75',
                map_center: [25, 10],
                first_name: randomStr,
                last_name: randomStr,
                company: randomStr,
                permissions: {
                    feature: [
                        'createTown',
                        'updateTown',
                        'deleteTown',
                        'createComment',
                        'updateComment',
                        'deleteComment',
                    ],
                    data: [],
                },
                active: true,
            },
            {
                id: 2,
                email: `${randomStr}2`,
                departement: '75',
                map_center: [25, 10],
                first_name: randomStr,
                last_name: randomStr,
                company: randomStr,
                permissions: {
                    feature: [],
                    data: [],
                },
                active: false,
            },
        ],
    },

    findOne: {
        inputs: commonInputs,
        output: {
            id: 1,
            email: randomStr,
            departement: '75',
            map_center: [25, 10],
            first_name: randomStr,
            last_name: randomStr,
            company: randomStr,
            permissions: {
                feature: [
                    'createTown',
                    'updateTown',
                    'deleteTown',
                    'createComment',
                    'updateComment',
                    'deleteComment',
                ],
                data: [],
            },
            active: true,
        },
    },

    findOneByEmail: {
        email: randomStr,
        inputs: commonInputs,
        output: {
            id: 1,
            email: randomStr,
            departement: '75',
            map_center: [25, 10],
            first_name: randomStr,
            last_name: randomStr,
            company: randomStr,
            permissions: {
                feature: [
                    'createTown',
                    'updateTown',
                    'deleteTown',
                    'createComment',
                    'updateComment',
                    'deleteComment',
                ],
                data: [],
            },
            active: true,
        },
    },

    findOneFullByEmail: {
        email: randomStr,
        salt: randomStr,
        password: randomStr,
        inputs: commonInputs,
    },

    findOneFull: {
        salt: randomStr,
        password: randomStr,
        inputs: commonInputs,
    },

    create: {
        inputs: commonInputs,
    },

    update: {
        inputs: commonInputs,
    },
};
