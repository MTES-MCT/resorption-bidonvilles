const a = [
    {
        role_regular: 'direct_collaborator',
        permissions: [
            { feature: 'close', level: 'own', finances: false },
        ],
    },
    {
        role_regular: 'collaborator',
        permissions: [
            { feature: 'close', level: 'own', finances: false },
        ],
    },
    {
        role_admin: 'local_admin',
        permissions: [
            { feature: 'close', level: 'local', finances: false },
        ],
    },
    {
        role_admin: 'national_admin',
        permissions: [
            { feature: 'close', level: 'nation', finances: false },
        ],
    },
];

module.exports = {
    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            'INSERT INTO features(name, fk_entity) VALUES(\'close\', \'plan\')',
            {
                transaction,
            },
        )
            .then(async () => {
                const { promises, finances: f } = a.reduce((acc, { role_admin, role_regular, permissions }) => {
                    const { promises: p, finances: f2 } = permissions.reduce((acc2, { feature, level, finances }) => ({
                        promises: [
                            ...acc2.promises,
                            queryInterface.sequelize.query(
                                `INSERT INTO
                                    permissions(fk_role_admin, fk_role_regular, fk_feature, fk_entity, allowed, fk_geographic_level)
                                VALUES
                                    (:role_admin, :role_regular, :feature, 'plan', TRUE, :level)
                                RETURNING permission_id`,
                                {
                                    replacements: {
                                        role_admin: role_admin || null,
                                        role_regular: role_regular || null,
                                        feature,
                                        level,
                                    },
                                    transaction,
                                },
                            ),
                        ],
                        finances: [
                            ...acc2.finances,
                            finances,
                        ],
                    }), { promises: [], finances: [] });

                    return {
                        promises: [
                            ...acc.promises,
                            ...p,
                        ],
                        finances: [
                            ...acc.finances,
                            ...f2,
                        ],
                    };
                }, { promises: [], finances: [] });

                const rows = await Promise.all(promises);
                return queryInterface.bulkInsert(
                    'plan_permissions',
                    rows.map((row, index) => ({
                        fk_permission: row[0][0].permission_id,
                        data_finances: f[index],
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
                fk_entity: 'plan',
                fk_feature: 'close',
            },
            {
                transaction,
            },
        )
            .then(() => queryInterface.bulkDelete(
                'features',
                {
                    name: 'close',
                    fk_entity: 'plan',
                },
                {
                    transaction,
                },
            )),
    ),

};
