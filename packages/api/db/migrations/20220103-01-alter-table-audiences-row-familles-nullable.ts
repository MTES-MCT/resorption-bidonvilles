module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.changeColumn(
        'audiences',
        'families',
        {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
    ),

    down: (queryInterface, Sequelize) => queryInterface.changeColumn(
        'audiences',
        'families',
        {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
    ),
};
