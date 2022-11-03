module.exports = {
    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.removeColumn(
            'users',
            'default_export',
            {
                transaction,
            },
        ),
    ),

    down: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.addColumn(
            'users',
            'default_export',
            {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            {
                transaction,
            },
        ),
    ),
};
