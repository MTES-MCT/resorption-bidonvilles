module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.addColumn(
        'plans',
        'fk_departement',
        {
            type: Sequelize.STRING(3),
            allowNull: false,
            defaultValue: null,
        },
    ),

    down: queryInterface => queryInterface.removeColumn(
        'plans',
        'fk_departement',
    ),

};
