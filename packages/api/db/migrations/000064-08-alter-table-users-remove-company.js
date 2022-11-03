module.exports = {

    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.removeColumn(
            'users',
            'company',
            {
                transaction,
            },
        ),
    ),

    down: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.addColumn(
            'users',
            'company',
            {
                type: Sequelize.STRING,
                allowNull: true,
                defaultValue: null,
            },
            { transaction },
        )
            .then(() => queryInterface.sequelize.query(
                'UPDATE users SET company = \'inconnu\'',
                { transaction },
            ))
            .then(() => queryInterface.changeColumn(
                'users',
                'company',
                {
                    type: Sequelize.STRING,
                    allowNull: false,
                    defaultValue: null,
                },
                { transaction },
            )),
    ),

};
