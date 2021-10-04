module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.createTable(
            'user_permission_options',
            {
                fk_user: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                fk_option: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
            },
            {
                transaction,
            },
        )
            .then(() => queryInterface.addConstraint(
                'user_permission_options',
                ['fk_user', 'fk_option'],
                {
                    type: 'primary key',
                    name: 'pk_user_permission_options',
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
                'user_permission_options',
                ['fk_user'],
                {
                    type: 'foreign key',
                    name: 'fk_user_permission_options_user',
                    references: {
                        table: 'users',
                        field: 'user_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'restrict',
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
                'user_permission_options',
                ['fk_option'],
                {
                    type: 'foreign key',
                    name: 'fk_user_permission_options_option',
                    references: {
                        table: 'permission_options',
                        field: 'uid',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'restrict',
                    transaction,
                },
            )),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.removeConstraint(
            'user_permission_options',
            'fk_user_permission_options_option',
            {
                transaction,
            },
        )
            .then(() => queryInterface.removeConstraint(
                'user_permission_options',
                'fk_user_permission_options_user',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeConstraint(
                'user_permission_options',
                'pk_user_permission_options',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.dropTable('user_permission_options', { transaction })),
    ),

};
