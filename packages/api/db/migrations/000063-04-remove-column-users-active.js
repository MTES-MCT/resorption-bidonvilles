module.exports = {

    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.removeColumn(
            'users',
            'active',
            {
                transaction,
            },
        ),
    ),

    down: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.addColumn(
            'users',
            'active',
            {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            { transaction },
        )
            .then(() => queryInterface.sequelize.query(
                'UPDATE users SET active = TRUE WHERE fk_status = \'active\'',
                { transaction },
            )),
    ),

};
