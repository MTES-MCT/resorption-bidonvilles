module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.addColumn(
        'user_mobile_navigation_logs',
        'origin',
        {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: null,

        },
    ),

    down: queryInterface => queryInterface.removeColumn(
        'user_mobile_navigation_logs',
        'origin',
    ),
};
