module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.addColumn(
            'shantytowns',
            'water_comments',
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
                'water_comments',
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
            'water_comments',
            { transaction },
        )
            .then(() => queryInterface.removeColumn(
                'ShantytownHistories',
                'water_comments',
                { transaction },
            )),
    ),

};
