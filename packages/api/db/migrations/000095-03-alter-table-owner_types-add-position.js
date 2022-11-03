module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.addColumn(
            'owner_types',
            'position',
            {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            {
                transaction,
            },
        )
            .then(() => Promise.all([
                queryInterface.sequelize.query(
                    'UPDATE owner_types SET position = 0 WHERE label = :value',
                    {
                        transaction,
                        replacements: { value: 'Public' },
                    },
                ),
                queryInterface.sequelize.query(
                    'UPDATE owner_types SET position = 1 WHERE label = :value',
                    {
                        transaction,
                        replacements: { value: 'Privé' },
                    },
                ),
                queryInterface.sequelize.query(
                    'UPDATE owner_types SET position = 2 WHERE label = :value',
                    {
                        transaction,
                        replacements: { value: 'Inconnu' },
                    },
                ),
            ]))
            .then(() => queryInterface.changeColumn(
                'electricity_types',
                'position',
                {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                {
                    transaction,
                },
            )),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.removeColumn(
            'owner_types',
            'position',
            { transaction },
        ),
    ),

};
