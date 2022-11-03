

module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => Promise.all([
            queryInterface.addColumn(
                'shantytowns',
                'is_reinstallation',
                {
                    type: Sequelize.BOOLEAN,
                    allowNull: true,
                },
                {
                    transaction,
                },
            ),
            queryInterface.addColumn(
                'ShantytownHistories',
                'is_reinstallation',
                {
                    type: Sequelize.BOOLEAN,
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
                'is_reinstallation',
                { transaction },
            ),
            queryInterface.removeColumn(
                'ShantytownHistories',
                'is_reinstallation',
                { transaction },
            ),
        ]),

    ),
};
