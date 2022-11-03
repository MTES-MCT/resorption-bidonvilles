module.exports = {

    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.removeColumn(
            'users',
            'fk_departement',
            {
                transaction,
            },
        ),
    ),

    down: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.addColumn(
            'users',
            'fk_departement',
            {
                type: Sequelize.STRING,
                allowNull: true,
            },
            { transaction },
        ),
    ),

};
