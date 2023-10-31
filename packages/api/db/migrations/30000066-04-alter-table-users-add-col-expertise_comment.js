module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.addColumn(
        'users',
        'expertise_comment',
        {
            type: Sequelize.TEXT,
            allowNull: true,
            defaultValue: null,
        },
    ),

    down: queryInterface => queryInterface.removeColumn(
        'users',
        'expertise_comment',
    ),
};
