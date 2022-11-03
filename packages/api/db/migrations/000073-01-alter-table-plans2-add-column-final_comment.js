module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.addColumn(
            'plans2',
            'final_comment',
            {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            {
                transaction,
            },
        )
            .then(() => queryInterface.addColumn(
                'plans_history',
                'final_comment',
                {
                    type: Sequelize.TEXT,
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
            'final_comment',
            { transaction },
        )
            .then(() => queryInterface.removeColumn(
                'plans_history',
                'final_comment',
                { transaction },
            )),
    ),

};
