

module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.addColumn(
        'users',
        'inactivity_alert_sent_at',
        {
            type: Sequelize.DATEONLY,
            allowNull: true,
            defaultValue: null,
        },
    ),

    down: queryInterface => queryInterface.removeColumn(
        'users',
        'inactivity_alert_sent_at',
    ),
};
