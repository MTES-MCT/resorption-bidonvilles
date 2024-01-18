

module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.addColumn(
        'users',
        'use_custom_intervention_area',
        {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    ),

    down: queryInterface => queryInterface.removeColumn(
        'users',
        'use_custom_intervention_area',
    ),
};
