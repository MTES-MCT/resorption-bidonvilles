module.exports = {

    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.removeConstraint(
            'role_permissions',
            'pk_role_permissions',
            { transaction },
        )
            .then(() => queryInterface.removeConstraint(
                'role_permissions',
                'fk_role_permissions_role',
                { transaction },
            ))
            .then(() => queryInterface.removeConstraint(
                'role_permissions',
                'fk_role_permissions_permission',
                { transaction },
            ))
            .then(() => queryInterface.dropTable('role_permissions', { transaction })),
    ),

    down: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.createTable(
            'role_permissions',
            {
                fk_role: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                fk_permission: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                created_at: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                },
                updated_at: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                    onUpdate: null,
                },
            },
            {
                transaction,
            },
        )
            .then(() => queryInterface.addConstraint(
                'role_permissions',
                ['fk_role', 'fk_permission'],
                {
                    type: 'primary key',
                    name: 'pk_role_permissions',
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
                'role_permissions',
                ['fk_role'],
                {
                    type: 'foreign key',
                    name: 'fk_role_permissions_role',
                    references: {
                        table: 'roles',
                        field: 'role_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'cascade',
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
                'role_permissions',
                ['fk_permission'],
                {
                    type: 'foreign key',
                    name: 'fk_role_permissions_permission',
                    references: {
                        table: 'permissions',
                        field: 'permission_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'cascade',
                    transaction,
                },
            )),
    ),

};
