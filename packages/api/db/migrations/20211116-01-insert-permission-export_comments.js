module.exports = {
    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            'INSERT INTO features(name, fk_entity) VALUES(\'export\', \'shantytown_comment\')',
            {
                transaction,
            },
        )
            .then(() => queryInterface.sequelize.query(
                `INSERT INTO permissions(fk_role_admin, fk_entity, fk_feature, allowed, fk_geographic_level)
                VALUES
                    ('national_admin', 'shantytown_comment', 'export', true, 'nation')`,
                {
                    transaction,
                },
            )),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            'DELETE FROM permissions WHERE fk_entity = \'shantytown_comment\' AND fk_feature = \'export\' AND fk_role_admin = \'national_admin\'',
            {
                transaction,
            },
        )
            .then(() => queryInterface.sequelize.query(
                'DELETE FROM features WHERE name = \'export\' AND fk_entity = \'shantytown_comment\'',
                {
                    transaction,
                },
            )),
    ),

};
