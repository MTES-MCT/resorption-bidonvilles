const runWithinTransaction = require('./common/helpers/transaction');

module.exports = {
    async up(queryInterface, Sequelize) {
        await runWithinTransaction(queryInterface, async (transaction) => {
            await queryInterface.createTable(
                'action_comment_user_targets',
                {
                    fk_user: {
                        type: Sequelize.INTEGER,
                        allowNull: false,
                        primaryKey: true,
                    },
                    fk_comment: {
                        type: Sequelize.INTEGER,
                        allowNull: false,
                        primaryKey: true,
                    },
                    created_at: {
                        type: Sequelize.DATE,
                        allowNull: false,
                        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                    },
                },
                { transaction },
            );

            await Promise.all([
                queryInterface.addConstraint(
                    'action_comment_user_targets',
                    {
                        fields: ['fk_user'],
                        type: 'foreign key',
                        name: 'fk__action_comment_user_targets__user',
                        references: {
                            table: 'users',
                            field: 'user_id',
                        },
                        onDelete: 'restrict',
                        onUpdate: 'cascade',
                        transaction,
                    },
                ),
                queryInterface.addConstraint(
                    'action_comment_user_targets',
                    {
                        fields: ['fk_comment'],
                        type: 'foreign key',
                        name: 'fk__action_comment_user_targets__comment',
                        references: {
                            table: 'action_comments',
                            field: 'action_comment_id',
                        },
                        onDelete: 'cascade',
                        onUpdate: 'cascade',
                        transaction,
                    },
                ),
            ]);
        });
    },

    async down(queryInterface) {
        await runWithinTransaction(queryInterface, async (transaction) => {
            await Promise.all([
                queryInterface.removeConstraint(
                    'action_comment_user_targets',
                    'fk__action_comment_user_targets__user',
                    { transaction },
                ),
                queryInterface.removeConstraint(
                    'action_comment_user_targets',
                    'fk__action_comment_user_targets__comment',
                    { transaction },
                ),
            ]);

            await queryInterface.dropTable('action_comment_user_targets', { transaction });
        });
    },
};
