

module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => Promise.all([
            queryInterface.addColumn(
                'shantytowns',
                'caravans',
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
                'caravans',
                {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                {
                    transaction,
                },
            ),
            queryInterface.addColumn(
                'shantytowns',
                'huts',
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
                'huts',
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
                'caravans',
                { transaction },
            ),
            queryInterface.removeColumn(
                'ShantytownHistories',
                'caravans',
                { transaction },
            ),
            queryInterface.removeColumn(
                'shantytowns',
                'huts',
                { transaction },
            ),
            queryInterface.removeColumn(
                'ShantytownHistories',
                'huts',
                { transaction },
            ),
        ]),

    ),
};
