module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        // on crée la table
        transaction => queryInterface.createTable(
            'user_navigation_logs',
            {
                user_navigation_log_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                },
                fk_user: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                datetime: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                },
                page: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
            },
            { transaction },
        )

            // on crée toutes les contraintes
            .then(() => queryInterface.addConstraint(
                'user_navigation_logs',
                ['fk_user'],
                {
                    type: 'foreign key',
                    name: 'fk_user_navigation_logs_user_id',
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
        // on supprime toutes les contraintes
        transaction => queryInterface.removeConstraint(
            'user_navigation_logs',
            'fk_user_navigation_logs_user_id',
            { transaction },
        )

            // on supprime la table
            .then(() => queryInterface.dropTable('user_navigation_logs', { transaction })),
    ),
};
