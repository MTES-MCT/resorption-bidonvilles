module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.addColumn(
            'features',
            'is_writing',
            {
                type: Sequelize.BOOLEAN,
                allowNull: true,
                defaultValue: false,
            },
            {
                transaction,
            },
        )
            .then(() => queryInterface.sequelize.query(
                `UPDATE features SET is_writing = true WHERE name IN (
                    'create', 'update', 'close',
                    'delete', 'moderate', 'activate',
                    'deactivate', 'updateMarks', 'createPrivate'
                )`,
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.changeColumn(
                'features',
                'is_writing',
                {
                    type: Sequelize.BOOLEAN,
                    allowNull: false,
                    defaultValue: null,
                },
                {
                    transaction,
                },
            )),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.removeColumn(
            'features',
            'is_writing',
            {
                transaction,
            },
        ),
    ),

};
