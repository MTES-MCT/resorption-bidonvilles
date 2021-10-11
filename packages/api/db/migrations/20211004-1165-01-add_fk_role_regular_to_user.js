module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.addColumn(
            'users',
            'fk_role_regular',
            {
                type: Sequelize.STRING,
                allowNull: true,
            },
            {
                transaction,
            },
        )
            .then(() => queryInterface.sequelize.query(
                'SELECT u.user_id, ot.fk_role FROM users u LEFT JOIN organizations o ON u.fk_organization = o.organization_id LEFT JOIN organization_types ot ON o.fk_type = organization_type_id',
                { transaction, type: queryInterface.sequelize.QueryTypes.SELECT },
            ))
            .then(userRoles => Promise.all(
                userRoles.map(({ user_id, fk_role }) => queryInterface.sequelize.query(
                    'UPDATE users SET fk_role_regular = :fk_role WHERE user_id = :user_id',
                    { transaction, replacements: { user_id, fk_role } },
                ))
                    .then(() => queryInterface.changeColumn(
                        'users',
                        'fk_role_regular',
                        {
                            type: Sequelize.STRING,
                            allowNull: false,
                        },
                        {
                            transaction,
                        },
                    )),
            ))
            .then(() => queryInterface.addConstraint(
                'users',
                ['fk_role_regular'],
                {
                    type: 'foreign key',
                    name: 'fk_users_role_regular',
                    references: {
                        table: 'roles_regular',
                        field: 'role_id',
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
            'fk_users_role_regular',
            { transaction },
        )
            .then(() => queryInterface.removeColumn(
                'users',
                'fk_role_regular',
                { transaction },
            )),
    ),
};
