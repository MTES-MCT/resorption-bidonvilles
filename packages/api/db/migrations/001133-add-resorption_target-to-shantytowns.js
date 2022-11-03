module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => Promise.all([
            queryInterface.addColumn(
                'shantytowns',
                'resorption_target',
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
                'resorption_target',
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
                'resorption_target',
                {
                    transaction,
                },
            ),
            queryInterface.removeColumn(
                'ShantytownHistories',
                'resorption_target',
                {
                    transaction,
                },
            ),
        ]),
    ),
};
