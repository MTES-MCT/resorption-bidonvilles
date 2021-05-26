module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.createTable(
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
                onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        },
    ).then(() => Promise.all([
        queryInterface.addConstraint('role_permissions', ['fk_role', 'fk_permission'], {
            type: 'primary key',
            name: 'pk_role_permissions',
        }),
        queryInterface.addConstraint('role_permissions', ['fk_role'], {
            type: 'foreign key',
            name: 'fk_role_permissions_role',
            references: {
                table: 'roles',
                field: 'role_id',
            },
            onUpdate: 'cascade',
            onDelete: 'cascade',
        }),
        queryInterface.addConstraint('role_permissions', ['fk_permission'], {
            type: 'foreign key',
            name: 'fk_role_permissions_permission',
            references: {
                table: 'permissions',
                field: 'permission_id',
            },
            onUpdate: 'cascade',
            onDelete: 'cascade',
        }),
    ])),

    down: queryInterface => queryInterface.dropTable('role_permissions'),
};
