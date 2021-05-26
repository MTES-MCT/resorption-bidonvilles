module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.addColumn(
        'users',
        'fk_role',
        {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 3,
        },
    ).then(() => Promise.all([
        queryInterface.addConstraint('users', ['fk_role'], {
            type: 'foreign key',
            name: 'fk_users_role',
            references: {
                table: 'roles',
                field: 'role_id',
            },
            onUpdate: 'cascade',
            onDelete: 'restrict',
        }),
        queryInterface.changeColumn(
            'users',
            'fk_role',
            {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: null,
            },
        ),
    ])),

    down: queryInterface => queryInterface.removeConstraint('users', 'fk_users_role')
        .then(() => queryInterface.removeColumn('users', 'fk_role')),
};
