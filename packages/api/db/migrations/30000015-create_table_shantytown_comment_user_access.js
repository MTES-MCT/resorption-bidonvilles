

module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        await queryInterface.createTable(
            'shantytown_comment_user_access',
            {
                fk_user: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                fk_comment: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                created_at: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                },

            },
            { transaction },
        );

        // add constraints
        await Promise.all([
            queryInterface.addConstraint(
                'shantytown_comment_user_access',
                ['fk_user'],
                {
                    type: 'foreign key',
                    name: 'fk_user_comment_access',
                    references: {
                        table: 'users',
                        field: 'user_id',
                    },
                    onDelete: 'cascade',
                    transaction,
                },
            ),
            queryInterface.addConstraint(
                'shantytown_comment_user_access',
                ['fk_comment'],
                {
                    type: 'foreign key',
                    name: 'fk_comment_user',
                    references: {
                        table: 'shantytown_comments',
                        field: 'shantytown_comment_id',
                    },
                    onDelete: 'cascade',
                    transaction,
                },
            ),
        ]);

        return transaction.commit();
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        await Promise.all([
            queryInterface.removeConstraint('shantytown_comment_user_access', 'fk_user_comment_access', { transaction }),
            queryInterface.removeConstraint('shantytown_comment_user_access', 'fk_comment_user', { transaction }),
        ]);

        await queryInterface.dropTable('shantytown_comment_user_access', { transaction });

        return transaction.commit();
    },
};
