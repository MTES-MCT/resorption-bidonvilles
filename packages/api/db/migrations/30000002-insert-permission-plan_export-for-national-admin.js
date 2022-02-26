module.exports = {
    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            'INSERT INTO features(name, fk_entity, is_writing) VALUES(\'export\', \'plan\', false)',
            {
                transaction,
            },
        )
            .then(() => queryInterface.sequelize.query(
                `INSERT INTO role_permissions(fk_role_admin, fk_feature, fk_entity, allowed, allow_all)
                VALUES('national_admin', 'export', 'plan', true, true)`,
                {
                    transaction,
                },
            )),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            'DELETE FROM features WHERE name = \'access\' AND fk_entity = \'contact_form_referral\'',
            {
                transaction,
            },
        )
            .then(() => queryInterface.sequelize.query(
                'DELETE FROM role_permissions WHERE fk_role_admin = \'national_admin\' AND fk_feature = \'export\' AND fk_entity = \'plan\'',
                {
                    transaction,
                },
            )),
    ),

};
