module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.addColumn(
            'plan_permissions',
            'data_finances',
            {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            {
                transaction,
            },
        ),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.removeColumn(
            'plan_permissions',
            'data_finances',
            { transaction },
        ),
    ),

};
