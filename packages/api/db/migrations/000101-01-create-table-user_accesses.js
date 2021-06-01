module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.createTable(
            'user_accesses',
            {
                user_access_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                },
                fk_user: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                sent_by: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                used_at: {
                    type: Sequelize.DATE,
                    allowNull: true,
                },
                expires_at: {
                    type: Sequelize.DATE,
                    allowNull: false,
                },
                created_at: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                },
            },
            {
                transaction,
            },
        )
            .then(() => queryInterface.addConstraint(
                'user_accesses',
                ['fk_user'],
                {
                    type: 'foreign key',
                    name: 'fk_user_accesses_user',
                    references: {
                        table: 'users',
                        field: 'user_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'cascade',
                    transaction,
                },
            ))
            .then(() => queryInterface.addConstraint(
                'user_accesses',
                ['sent_by'],
                {
                    type: 'foreign key',
                    name: 'fk_user_accesses_admin',
                    references: {
                        table: 'users',
                        field: 'user_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'cascade',
                    transaction,
                },
            ))
            .then(() => queryInterface.sequelize.query(
                `SELECT
                    user_id AS fk_user,
                    CASE
                        WHEN fk_status <> 'new' THEN COALESCE(activated_by, created_by)
                        ELSE NULL
                    END AS sent_by,
                    CASE
                        WHEN fk_status <> 'new' THEN activated_on
                        ELSE NULL
                    END AS used_at,
                    CASE
                        WHEN fk_status <> 'new' THEN activated_on + (interval '1 day')
                        ELSE last_activation_link_sent_on + (interval '7 days')
                    END AS expires_at,
                    CASE
                        WHEN fk_status <> 'new' THEN COALESCE(last_activation_link_sent_on, created_at)
                        ELSE last_activation_link_sent_on
                    END AS created_at
                FROM users
                WHERE fk_status <> 'new' OR (fk_status = 'new' AND last_activation_link_sent_on IS NOT NULL)`,
                {
                    type: queryInterface.sequelize.QueryTypes.SELECT,
                    transaction,
                },
            ))
            .then(data => data.length > 0 ? queryInterface.bulkInsert(
                'user_accesses',
                data,
                {
                    transaction,
                },
            ) : true),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.removeConstraint(
            'user_accesses',
            'fk_user_accesses_admin',
            {
                transaction,
            },
        )
            .then(() => queryInterface.removeConstraint(
                'user_accesses',
                'fk_user_accesses_user',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.dropTable('user_accesses', { transaction })),
    ),

};
