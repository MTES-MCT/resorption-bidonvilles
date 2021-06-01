module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.addColumn(
            'users',
            'activated_by',
            {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            {
                transaction,
            },
        )
            .then(() => queryInterface.changeColumn(
                'users',
                'activated_by',
                {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                    defaultValue: null,
                },
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
                'users',
                ['activated_by'],
                {
                    type: 'foreign key',
                    name: 'fk_users_activated_by',
                    references: {
                        table: 'users',
                        field: 'user_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'restrict',
                    transaction,
                },
            )),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.removeConstraint(
            'users',
            'fk_users_activated_by',
            { transaction },
        ).then(() => queryInterface.removeColumn(
            'users',
            'activated_by',
            { transaction },
        )),
    ),

};
