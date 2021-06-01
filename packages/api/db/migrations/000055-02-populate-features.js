const features = {
    shantytown: [
        'list',
        'read',
        'create',
        'update',
        'close',
        'export',
        'delete',
    ],
    shantytown_comment: [
        'list',
        'create',
        'moderate',
    ],
    plan: [
        'list',
        'read',
        'create',
        'update',
        'delete',
    ],
    user: [
        'list',
        'read',
        'create',
        'activate',
        'deactivate',
        'delete',
    ],
    stats: [
        'read',
    ],
};

module.exports = {

    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.bulkInsert(
            'features',
            Object.keys(features).reduce((acc, entity) => [
                ...acc,
                ...features[entity].map(name => ({ name, fk_entity: entity })),
            ], []),
            {
                transaction,
            },
        ),
    ),

    down: queryInterface => queryInterface.bulkDelete('features'),

};
