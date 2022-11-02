module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.addColumn(
        'users',
        'default_export',
        {
            type: Sequelize.TEXT,
            allowNull: true,
        },
    ),

    down: queryInterface => queryInterface.removeColumn('users', 'default_export'),

};
