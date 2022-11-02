module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.addColumn(
            'users',
            'last_changelog',
            {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: '0.0.0',
            },
            {
                transaction,
            },
        ),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.removeColumn(
            'users',
            'last_changelog',
            { transaction },
        ),
    ),

};
