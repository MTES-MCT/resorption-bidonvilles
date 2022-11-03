module.exports = {
    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            `SELECT
                p.fk_organization,
                p.fk_role_admin,
                p.fk_role_regular,
                ARRAY_AGG(data_justice) AS "value"
            FROM permissions p
            LEFT JOIN shantytown_permissions sp ON sp.fk_permission = p.permission_id
            WHERE p.fk_entity = 'shantytown'
            GROUP BY p.fk_organization, p.fk_role_admin, p.fk_role_regular`,
            {
                type: queryInterface.sequelize.QueryTypes.SELECT,
                transaction,
            },
        )
            .then(rows => queryInterface.bulkInsert(
                'permissions',
                rows.map(({
                    fk_organization, fk_role_admin, fk_role_regular, value,
                }) => ({
                    fk_organization,
                    fk_role_admin,
                    fk_role_regular,
                    fk_feature: 'access',
                    fk_entity: 'shantytown_justice',
                    allowed: value.includes(true),
                    fk_geographic_level: value.includes(true) ? 'local' : null,
                })),
                { transaction },
            )),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            'DELETE FROM permissions WHERE fk_entity IN (\'shantytown_justice\')',
            { transaction },
        ),
    ),

};
