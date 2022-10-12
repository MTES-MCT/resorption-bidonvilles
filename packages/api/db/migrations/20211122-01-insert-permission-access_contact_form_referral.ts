module.exports = {
    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            'INSERT INTO entities(name) VALUES(\'contact_form_referral\')',
            {
                transaction,
            },
        )
            .then(() => queryInterface.sequelize.query(
                'INSERT INTO features(name, fk_entity) VALUES(\'access\', \'contact_form_referral\')',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.sequelize.query(
                `INSERT INTO permissions(fk_role_admin, fk_entity, fk_feature, allowed, fk_geographic_level)
                VALUES
                    ('national_admin', 'contact_form_referral', 'access', true, 'nation')`,
                {
                    transaction,
                },
            )),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            'DELETE FROM permissions WHERE fk_entity = \'contact_form_referral\' AND fk_feature = \'access\' AND fk_role_admin = \'national_admin\'',
            {
                transaction,
            },
        )
            .then(() => queryInterface.sequelize.query(
                'DELETE FROM features WHERE name = \'access\' AND fk_entity = \'contact_form_referral\'',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.sequelize.query(
                'DELETE FROM entities WHERE name = \'contact_form_referral\'',
                {
                    transaction,
                },
            )),
    ),

};
