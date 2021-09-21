module.exports = {
    up: queryInterface => queryInterface.removeColumn('users', 'default_export'),

    down: (queryInterface, Sequelize) => queryInterface.addColumn(
        'users',
        'default_export',
        {
            type: Sequelize.TEXT,
            allowNull: true,
        },
    ),
};
