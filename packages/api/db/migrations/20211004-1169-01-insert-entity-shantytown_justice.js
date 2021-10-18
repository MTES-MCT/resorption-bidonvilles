module.exports = {
    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.bulkInsert(
            'entities',
            [{ name: 'shantytown_justice' }],
            { transaction },
        )
            .then(() => queryInterface.bulkInsert(
                'features',
                [
                    { name: 'access', fk_entity: 'shantytown_justice' },
                ],
                { transaction },
            )),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            'DELETE FROM features WHERE fk_entity IN (\'shantytown_justice\')',
            { transaction },
        )
            .then(() => queryInterface.sequelize.query(
                'DELETE FROM entities WHERE name IN (\'shantytown_justice\')',
                { transaction },
            )),
    ),

};
