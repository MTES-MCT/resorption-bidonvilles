module.exports = {

    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.removeConstraint(
            'users',
            'fk_users_activated_by',
            {
                transaction,
            },
        )
            .then(() => queryInterface.removeColumn(
                'users',
                'activated_by',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeColumn(
                'users',
                'activated_on',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.removeColumn(
                'users',
                'last_activation_link_sent_on',
                {
                    transaction,
                },
            )),
    ),

    down: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.addColumn(
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
        )
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
            ))
            .then(() => queryInterface.addColumn(
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
            ))
            .then(() => queryInterface.addColumn(
                'users',
                'last_activation_link_sent_on',
                {
                    type: Sequelize.DATE,
                    allowNull: true,
                },
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.sequelize.query(
                `SELECT
                    user_id,
                    sent_by,
                    used_at,
                    last_user_accesses.created_at
                FROM
                    users
                LEFT JOIN
                    last_user_accesses ON last_user_accesses.fk_user = users.user_id
                `,
                {
                    type: queryInterface.sequelize.QueryTypes.SELECT,
                    transaction,
                },
            ))
            .then(users => Promise.all(
                users.map(user => queryInterface.sequelize.query(
                    `UPDATE users
                        SET
                            activated_by = :activated_by,
                            activated_on = :activated_on,
                            last_activation_link_sent_on = :last_activation_link_sent_on
                        WHERE
                            user_id = :user_id`,
                    {
                        replacements: {
                            activated_by: user.sent_by || null,
                            activated_on: user.used_at || null,
                            last_activation_link_sent_on: user.created_at || null,
                            user_id: user.user_id,
                        },
                        transaction,
                    },
                )),
            )),
    ),

};
