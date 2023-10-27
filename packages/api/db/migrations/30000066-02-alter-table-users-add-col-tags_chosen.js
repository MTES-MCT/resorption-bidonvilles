module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.addColumn(
        'users',
        'tags_chosen',
        {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    ),

    down: queryInterface => queryInterface.removeColumn(
        'users',
        'tags_chosen',
    ),
};
