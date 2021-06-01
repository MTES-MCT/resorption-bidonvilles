module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.removeConstraint(
            'users',
            'fk_users_role',
            {
                transaction,
            },
        )
            .then(() => queryInterface.changeColumn(
                'users',
                'fk_role',
                {
                    type: Sequelize.STRING,
                    allowNull: true,
                    defaultValue: null,
                },
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.sequelize.query(
                'UPDATE users SET fk_role = NULL',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
                'users',
                ['fk_role'],
                {
                    type: 'foreign key',
                    name: 'fk_users_role',
                    references: {
                        table: 'roles_admin',
                        field: 'role_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'restrict',
                    transaction,
                },
            )),
    ),

    down: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.removeConstraint(
            'users',
            'fk_users_role',
            { transaction },
        )
            .then(() => queryInterface.removeColumn(
                'users',
                'fk_role',
                { transaction },
            ))
            .then(() => queryInterface.addColumn(
                'users',
                'fk_role',
                {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                    defaultValue: null,
                },
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.sequelize.query(
                'SELECT role_id FROM roles WHERE name = \'visitor\'',
                {
                    type: queryInterface.sequelize.QueryTypes.SELECT,
                },
            ))
            .then(([{ role_id: roleId }]) => queryInterface.sequelize.query(
                'UPDATE users SET fk_role = :roleId',
                {
                    replacements: {
                        roleId,
                    },
                    transaction,
                },
            ))
            .then(() => queryInterface.changeColumn(
                'users',
                'fk_role',
                {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    defaultValue: null,
                },
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
                'users',
                ['fk_role'],
                {
                    type: 'foreign key',
                    name: 'fk_users_role',
                    references: {
                        table: 'roles',
                        field: 'role_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'restrict',
                    transaction,
                },
            )),
    ),

};
