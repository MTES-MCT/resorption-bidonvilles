module.exports = {
    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            'INSERT INTO entities(name) VALUES(\'shantytown_history\')',
            {
                transaction,
            },
        )
            .then(() => queryInterface.sequelize.query(
                'INSERT INTO features(name, fk_entity, is_writing) VALUES(\'export\', \'shantytown_history\', false)',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.sequelize.query(
                `INSERT INTO role_permissions(fk_role_admin, fk_feature, fk_entity, allowed, allow_all)
                VALUES('national_admin', 'export', 'shantytown_history', true, true)`,
                {
                    transaction,
                },
            )),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            'DELETE FROM role_permissions WHERE fk_role_admin = \'national_admin\' AND fk_feature = \'export\' AND fk_entity = \'shantytown_history\'',
            {
                transaction,
            },
        )
            .then(() => queryInterface.sequelize.query(
                'DELETE FROM features WHERE name = \'export\' AND fk_entity = \'shantytown_history\'',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.sequelize.query(
                'DELETE FROM entities WHERE name = \'shantytown_history\'',
                {
                    transaction,
                },
            )),
    ),

};
