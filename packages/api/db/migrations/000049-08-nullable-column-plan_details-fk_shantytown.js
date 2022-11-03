module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.changeColumn(
        'plan_details',
        'fk_shantytown',
        {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
    ),

    down: (queryInterface, Sequelize) => queryInterface.changeColumn(
        'plan_details',
        'fk_shantytown',
        {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
    ),

};
