

module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => Promise.all([
            queryInterface.addColumn(
                'shantytowns',
                'heatwave_status',
                {
                    type: Sequelize.BOOLEAN,
                    allowNull: false,
                    defaultValue: false,
                },
                {
                    transaction,
                },
            ),
            queryInterface.addColumn(
                'ShantytownHistories',
                'heatwave_status',
                {
                    type: Sequelize.BOOLEAN,
                    allowNull: false,
                    defaultValue: false,
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
                'heatwave_status',
                { transaction },
            ),
            queryInterface.removeColumn(
                'ShantytownHistories',
                'heatwave_status',
                { transaction },
            ),
        ]),

    ),
};
