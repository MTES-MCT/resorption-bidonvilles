module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.addColumn(
        'users',
        'subscribed_to_summary',
        {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    ),

    down: queryInterface => queryInterface.removeColumn('users', 'subscribed_to_summary'),
};
