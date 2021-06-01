module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.addColumn(
            'users',
            'fk_status',
            {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: 'new',
            },
            {
                transaction,
            },
        )
            .then(() => queryInterface.changeColumn(
                'users',
                'fk_status',
                {
                    type: Sequelize.STRING,
                    allowNull: false,
                    defaultValue: null,
                },
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.sequelize.query(
                'UPDATE users SET fk_status = \'active\' WHERE users.active = true AND users.password IS NOT NULL',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.sequelize.query(
                'UPDATE users SET fk_status = \'inactive\' WHERE users.active = true AND users.password IS NULL',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
                'users',
                ['fk_status'],
                {
                    type: 'foreign key',
                    name: 'fk_users_status',
                    references: {
                        table: 'user_statuses',
                        field: 'user_status_id',
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
            'fk_users_status',
            { transaction },
        )
            .then(() => queryInterface.removeColumn(
                'users',
                'fk_status',
                { transaction },
            )),
    ),

};
