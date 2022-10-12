const a = [
    {
        role_regular: 'national_establisment',
        level: 'nation',
    },
    {
        role_regular: 'direct_collaborator',
        level: 'local',
    },
    {
        role_admin: 'local_admin',
        level: 'local',
    },
    {
        role_admin: 'national_admin',
        level: 'nation',
    },
];

module.exports = {
    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            'INSERT INTO entities(name) VALUES(\'plan_finances\')',
            {
                transaction,
            },
        )
            .then(() => queryInterface.sequelize.query(
                'INSERT INTO features(name, fk_entity) VALUES(\'access\', \'plan_finances\')',
                {
                    transaction,
                },
            ))
            .then(async () => {
                const promises = a.reduce((acc, { role_admin, role_regular, level }) => ([
                    ...acc,
                    queryInterface.sequelize.query(
                        `INSERT INTO
                        permissions(fk_role_admin, fk_role_regular, fk_feature, fk_entity, allowed, fk_geographic_level)
                    VALUES
                        (:role_admin, :role_regular, 'access', 'plan_finances', TRUE, :level)
                    RETURNING permission_id`,
                        {
                            replacements: {
                                role_admin: role_admin || null,
                                role_regular: role_regular || null,
                                level,
                            },
                            transaction,
                        },
                    ),
                ]), []);

                const rows = await Promise.all(promises);
                return queryInterface.bulkInsert(
                    'plan_finances_permissions',
                    rows.map(row => ({
                        fk_permission: row[0][0].permission_id,
                    })),
                    {
                        transaction,
                    },
                );
            }),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.bulkDelete(
            'permissions',
            {
                fk_entity: 'plan_finances',
            },
            {
                transaction,
            },
        )
            .then(() => queryInterface.bulkDelete(
                'features',
                {
                    fk_entity: 'plan_finances',
                },
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.bulkDelete(
                'entities',
                {
                    name: 'plan_finances',
                },
                {
                    transaction,
                },
            )),
    ),

};
