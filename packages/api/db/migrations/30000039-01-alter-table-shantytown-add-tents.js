module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => Promise.all([
            queryInterface.addColumn(
                'shantytowns',
                'tents',
                {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                {
                    transaction,
                },
            ),
            queryInterface.addColumn(
                'ShantytownHistories',
                'tents',
                {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                {
                    transaction,
                },
            ),
        ]),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => Promise.all([
            queryInterface.removeColumn(
                'shantytowns',
                'tents',
                { transaction },
            ),
            queryInterface.removeColumn(
                'ShantytownHistories',
                'tents',
                { transaction },
            ),
        ]),
    ),
};
