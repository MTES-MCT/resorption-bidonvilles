const a = [
    {
        role_regular: 'national_establisment',
        permissions: [
            { feature: 'list', level: 'nation', finances: true },
            { feature: 'read', level: 'nation', finances: true },
        ],
    },
    {
        role_regular: 'direct_collaborator',
        permissions: [
            { feature: 'list', level: 'nation', finances: false },
            { feature: 'read', level: 'nation', finances: false },
            { feature: 'create', level: 'local', finances: true },
            { feature: 'update', level: 'own', finances: true },
            { feature: 'updateMarks', level: 'own', finances: true },
        ],
    },
    {
        role_regular: 'collaborator',
        permissions: [
            { feature: 'list', level: 'local', finances: false },
            { feature: 'read', level: 'local', finances: false },
            { feature: 'updateMarks', level: 'own', finances: false },
        ],
    },
    {
        role_regular: 'association',
        permissions: [
            { feature: 'list', level: 'local', finances: false },
            { feature: 'read', level: 'local', finances: false },
            { feature: 'updateMarks', level: 'own', finances: false },
        ],
    },
    {
        role_admin: 'local_admin',
        permissions: [
            { feature: 'list', level: 'nation', finances: false },
            { feature: 'read', level: 'nation', finances: false },
            { feature: 'create', level: 'local', finances: true },
            { feature: 'update', level: 'local', finances: true },
            { feature: 'updateMarks', level: 'local', finances: true },
        ],
    },
    {
        role_admin: 'national_admin',
        permissions: [
            { feature: 'list', level: 'nation', finances: true },
            { feature: 'read', level: 'nation', finances: true },
            { feature: 'create', level: 'nation', finances: true },
            { feature: 'update', level: 'nation', finances: true },
            { feature: 'updateMarks', level: 'nation', finances: true },
            { feature: 'delete', level: 'nation', finances: true },
        ],
    },
];

module.exports = {
    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            'INSERT INTO geographic_levels(name) VALUES(\'own\')',
            {
                transaction,
            },
        )
            .then(() => queryInterface.sequelize.query(
                'INSERT INTO features(name, fk_entity) VALUES(\'updateMarks\', \'plan\')',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.bulkDelete(
                'permissions',
                {
                    fk_entity: 'plan',
                },
                {
                    transaction,
                },
            ))
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
            },
            {
                transaction,
            },
        ),
    ),

};
