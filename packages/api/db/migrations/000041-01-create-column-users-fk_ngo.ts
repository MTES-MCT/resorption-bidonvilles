module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.addColumn(
        'users',
        'fk_ngo',
        {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: null,
        },
    ),

    down: queryInterface => queryInterface.removeColumn(
        'users',
        'fk_ngo',
    ),

};
