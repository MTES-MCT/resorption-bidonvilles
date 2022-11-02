module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.addColumn(
            'users',
            'activated_on',
            {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: null,
            },
            {
                transaction,
            },
        )
            .then(() => queryInterface.bulkUpdate(
                'users',
                {
                    activated_on: new Date(2019, 0, 1), /* symbolic date */
                },
                {
                    [Sequelize.Op.or]: [
                        { fk_status: 'active' },
                        { fk_status: 'inactive' },
                    ],
                },
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.changeColumn(
                'users',
                'activated_on',
                {
                    type: Sequelize.DATE,
                    allowNull: true,
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
            'activated_on',
            { transaction },
        ),
    ),

};
