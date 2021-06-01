

module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => Promise.all([
            queryInterface.addColumn(
                'shantytowns',
                'name',
                {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                {
                    transaction,
                },
            ),
            queryInterface.addColumn(
                'ShantytownHistories',
                'name',
                {
                    type: Sequelize.STRING,
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
                'name',
                { transaction },
            ),
            queryInterface.removeColumn(
                'ShantytownHistories',
                'name',
                { transaction },
            ),
        ]),

    ),
};
