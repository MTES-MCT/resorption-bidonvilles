module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.addColumn(
            'field_types',
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
                    'UPDATE field_types SET position = 0 WHERE label = :value',
                    {
                        transaction,
                        replacements: { value: 'Terrain' },
                    },
                ),
                queryInterface.sequelize.query(
                    'UPDATE field_types SET position = 1 WHERE label = :value',
                    {
                        transaction,
                        replacements: { value: 'Immeuble bâti' },
                    },
                ),
                queryInterface.sequelize.query(
                    'UPDATE field_types SET position = 2 WHERE label = :value',
                    {
                        transaction,
                        replacements: { value: 'Inconnu' },
                    },
                ),
            ]))
            .then(() => queryInterface.changeColumn(
                'field_types',
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
            'field_types',
            'position',
            { transaction },
        ),
    ),

};
