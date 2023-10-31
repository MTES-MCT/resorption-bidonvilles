module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.addColumn(
        'users',
        'expertise_topics_chosen',
        {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    ),

    down: queryInterface => queryInterface.removeColumn(
        'users',
        'expertise_topics_chosen',
    ),
};
