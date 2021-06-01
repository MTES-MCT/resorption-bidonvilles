module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.addColumn(
            'shantytowns',
            'electricity_comments',
            {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            {
                transaction,
            },
        )
            .then(() => queryInterface.addColumn(
                'ShantytownHistories',
                'electricity_comments',
                {
                    type: Sequelize.TEXT,
                    allowNull: true,
                },
                {
                    transaction,
                },
            )),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.removeColumn(
            'shantytowns',
            'electricity_comments',
            { transaction },
        )
            .then(() => queryInterface.removeColumn(
                'ShantytownHistories',
                'electricity_comments',
                { transaction },
            )),
    ),

};
