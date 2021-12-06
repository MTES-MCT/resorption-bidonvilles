const permissions = {
    roles_regular: {
        external_observator: {
            shantytown: {
                list: { level: 'local', data: { data_justice: false } },
                read: { level: 'local', data: { data_justice: false } },
            },
            plan: {
                list: { level: 'local', data: { data_finances: false } },
                read: { level: 'local', data: { data_finances: false } },
            },
            shantytown_comment: {
                list: { level: 'local', data: {} },
            },
            covid_comment: {
                list: { level: 'local', data: {} },
            },
        },
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
                const p = Object.keys(permissions).reduce((promises, roleType) => {
                    Object.keys(permissions[roleType]).forEach((roleId) => {
                        Object.keys(permissions[roleType][roleId]).forEach((entity) => {
                            Object.keys(permissions[roleType][roleId][entity]).forEach((feature) => {
                                promises.push(
                                    queryInterface.sequelize.query(
                                        `INSERT INTO
                                            permissions(fk_role_admin, fk_role_regular, fk_feature, fk_entity, allowed, fk_geographic_level)
                                        VALUES
                                            (:adminId, :regularId, :feature, :entity, TRUE, :level)
                                        RETURNING permission_id`,
                                        {
                                            transaction,
                                            replacements: {
                                                adminId: roleType === 'roles_admin' ? roleId : null,
                                                regularId: roleType === 'roles_regular' ? roleId : null,
                                                feature,
                                                entity,
                                                level: permissions[roleType][roleId][entity][feature].level,
                                            },
                                        },
                                    ),
                                );
                            });
                        });
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
