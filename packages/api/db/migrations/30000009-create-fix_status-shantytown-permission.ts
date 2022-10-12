module.exports = {
    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            'INSERT INTO features(name, fk_entity, is_writing) VALUES(\'fix_status\', \'shantytown\', true)',
            {
                transaction,
            },
        )
            .then(() => queryInterface.sequelize.query(
                `INSERT INTO role_permissions(fk_role_admin, fk_feature, fk_entity, allowed, allow_all)
                VALUES('national_admin', 'fix_status', 'shantytown', true, true)`,
                {
                    transaction,
                },
            )),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            'DELETE FROM role_permissions WHERE fk_role_admin = \'national_admin\' AND fk_feature = \'fix_status\' AND fk_entity = \'shantytown\'',
            {
                transaction,
            },
        )
            .then(() => queryInterface.sequelize.query(
                'DELETE FROM features WHERE name = \'fix_status\' AND fk_entity = \'shantytown\'',
                {
                    transaction,
                },
            )),
    ),

};
