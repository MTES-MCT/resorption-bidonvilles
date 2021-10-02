module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.addColumn(
        'users',
        'admin_comments',
        {
            type: Sequelize.TEXT,
            allowNull: true,
        },
    ),

    down: queryInterface => queryInterface.removeColumn('users', 'admin_comments'),
};
