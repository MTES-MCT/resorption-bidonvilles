module.exports = {

    up: queryInterface => queryInterface.bulkDelete(
        'permissions',
        {
            fk_role_regular: 'association',
            fk_feature: 'create',
            fk_entity: 'shantytown',
        },
    ),

    down: queryInterface => queryInterface.bulkInsert(
        'permissions',
        [{
            fk_role_regular: 'association',
            fk_feature: 'create',
            fk_entity: 'shantytown',
            allowed: true,
            fk_geographic_level: 'local',
        }],
    ),
};
