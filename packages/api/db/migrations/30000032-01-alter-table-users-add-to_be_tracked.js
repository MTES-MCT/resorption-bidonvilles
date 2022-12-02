module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.addColumn(
        'users',
        'to_be_tracked',
        {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,

        },
    ),

    down: queryInterface => queryInterface.removeColumn(
        'users',
        'to_be_tracked',
    ),
};
