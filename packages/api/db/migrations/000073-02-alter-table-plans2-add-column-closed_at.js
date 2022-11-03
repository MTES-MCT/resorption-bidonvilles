module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.addColumn(
            'plans2',
            'closed_at',
            {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },
            {
                transaction,
            },
        )
            .then(() => queryInterface.addColumn(
                'plans_history',
                'closed_at',
                {
                    type: Sequelize.DATEONLY,
                    allowNull: true,
                },
                {
                    transaction,
                },
            )),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.removeColumn(
            'plans2',
            'closed_at',
            { transaction },
        )
            .then(() => queryInterface.removeColumn(
                'plans_history',
                'closed_at',
                { transaction },
            )),
    ),

};
