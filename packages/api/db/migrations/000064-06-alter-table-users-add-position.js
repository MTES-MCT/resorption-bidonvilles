module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.addColumn(
            'users',
            'position',
            {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: '',
            },
            {
                transaction,
            },
        )
            .then(() => queryInterface.changeColumn(
                'users',
                'position',
                {
                    type: Sequelize.STRING,
                    allowNull: false,
                    defaultValue: null,
                },
                {
                    transaction,
                },
            )),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.removeColumn(
            'users',
            'position',
            { transaction },
        ),
    ),

};
