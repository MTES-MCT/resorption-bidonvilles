module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.addColumn(
            'finance_rows_history',
            'real_amount',
            {
                type: Sequelize.DOUBLE,
                allowNull: true,
            },
            {
                transaction,
            },
        ),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.removeColumn(
            'finance_rows_history',
            'real_amount',
            { transaction },
        ),
    ),

};
