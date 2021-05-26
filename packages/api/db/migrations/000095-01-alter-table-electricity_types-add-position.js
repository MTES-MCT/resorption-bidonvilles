
module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.addColumn(
            'electricity_types',
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
                    'UPDATE electricity_types SET position = 0 WHERE label = :value',
                    {
                        transaction,
                        replacements: { value: 'Oui' },
                    },
                ),
                queryInterface.sequelize.query(
                    'UPDATE electricity_types SET position = 1 WHERE label = :value',
                    {
                        transaction,
                        replacements: { value: 'Oui (accès régulier)' },
                    },
                ),
                queryInterface.sequelize.query(
                    'UPDATE electricity_types SET position = 2 WHERE label = :value',
                    {
                        transaction,
                        replacements: { value: 'Oui (accès irrégulier)' },
                    },
                ),
                queryInterface.sequelize.query(
                    'UPDATE electricity_types SET position = 3 WHERE label = :value',
                    {
                        transaction,
                        replacements: { value: 'Non' },
                    },
                ),
                queryInterface.sequelize.query(
                    'UPDATE electricity_types SET position = 4 WHERE label = :value',
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
            ))
        ,
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.removeColumn(
            'electricity_types',
            'position',
            { transaction },
        ),
    ),

};
