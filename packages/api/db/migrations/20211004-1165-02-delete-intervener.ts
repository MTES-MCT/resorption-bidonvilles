module.exports = {

    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.bulkDelete(
            'organization_types',
            {
                fk_role: 'intervener',
                fk_category: 'intervener',
            },
            {
                transaction,
            },
        )
            .then(() => queryInterface.bulkDelete(
                'organization_categories',
                {
                    uid: 'intervener',
                },
                {
                    transaction,
                },
            )),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            'INSERT INTO organization_categories(uid, name_singular, name_plural) VALUES(\'intervener\', \'Intervenant\', \'Intervenants\')',
            {
                transaction,
            },
        )
            .then(() => queryInterface.sequelize.query(
                'INSERT INTO organization_types(name_singular, name_plural, fk_category, fk_role, uid) VALUES(\'Intervenant\', \'Intervenants\', \'intervener\', \'intervener\', \'intervenant\')',
                {
                    transaction,
                },
            )),
    ),
};
