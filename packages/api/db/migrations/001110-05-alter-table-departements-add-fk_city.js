module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.addColumn(
            'departements',
            'fk_city',
            {
                type: Sequelize.STRING(5),
                allowNull: true,
            },
            {
                transaction,
            },
        ),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.removeColumn(
            'departements',
            'fk_city',
            {
                transaction,
            },
        ),
    ),

};
