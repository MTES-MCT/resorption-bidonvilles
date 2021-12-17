const permissions = {
    shantytown: {
        list: { level: 'local' },
        read: { level: 'local' },
    },
    plan: {
        list: { level: 'local' },
        read: { level: 'local' },
    },
    shantytown_comment: {
        list: { level: 'local' },
    },
    covid_comment: {
        list: { level: 'local' },
    },
};
module.exports = {

    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.bulkInsert(
            'roles_regular',
            [
                { role_id: 'external_observator', name: 'Observateur externe' },
            ],
            { transaction },
        )
            .then(async () => {
                const p = Object.keys(permissions).reduce((promises, entity) => {
                    Object.keys(permissions[entity]).forEach((feature) => {
                        promises.push(
                            queryInterface.sequelize.query(
                                `INSERT INTO
                                            permissions(fk_role_regular, fk_feature, fk_entity, allowed, fk_geographic_level)
                                        VALUES
                                            ('external_observator', :feature, :entity, TRUE, :level)
                                        RETURNING permission_id`,
                                {
                                    transaction,
                                    replacements: {
                                        feature,
                                        entity,
                                        level: permissions[entity][feature].level,
                                    },
                                },
                            ),
                        );
                    });

                    return promises;
                }, []);

                return Promise.all(p);
            }),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.bulkDelete(
            'permissions',
            {
                fk_role_regular: 'external_observator',
            },
            {
                transaction,
            },
        )
            .then(() => queryInterface.bulkDelete(
                'roles_regular',
                [
                    { role_id: 'external_observator', name: 'Observateur externe' },
                ],
                { transaction },
            )),
    ),
};
