// actions
module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            // création des tables
            await queryInterface.createTable(
                'action_comments',
                {
                    action_comment_id: {
                        type: Sequelize.INTEGER,
                        allowNull: false,
                        primaryKey: true,
                        autoIncrement: true,
                    },
                    fk_action: {
                        type: Sequelize.INTEGER,
                        allowNull: false,
                    },
                    description: {
                        type: Sequelize.TEXT,
                        allowNull: false,
                    },
                    created_at: {
                        type: Sequelize.DATE,
                        allowNull: false,
                        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                    },
                    created_by: {
                        type: Sequelize.INTEGER,
                        allowNull: false,
                    },
                    updated_at: {
                        type: Sequelize.DATE,
                        allowNull: true,
                    },
                    updated_by: {
                        type: Sequelize.INTEGER,
                        allowNull: true,
                    },
                },
                {
                    transaction,
                },
            );

            // création des contraintes (clés étrangères, checks...)
            await Promise.all([
                queryInterface.addConstraint('action_comments', {
                    fields: ['fk_action'],
                    type: 'foreign key',
                    name: 'fk__action_comments__action',
                    references: {
                        table: 'actions',
                        field: 'action_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'cascade',
                    transaction,
                }),
                queryInterface.addConstraint('action_comments', {
                    fields: ['created_by'],
                    type: 'foreign key',
                    name: 'fk__action_comments__creator',
                    references: {
                        table: 'users',
                        field: 'user_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'restrict',
                    transaction,
                }),
                queryInterface.addConstraint('action_comments', {
                    fields: ['updated_by'],
                    type: 'foreign key',
                    name: 'fk__action_comments__editor',
                    references: {
                        table: 'users',
                        field: 'user_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'restrict',
                    transaction,
                }),
            ]);

            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await Promise.all([
                queryInterface.removeConstraint(
                    'action_comments',
                    'fk__action_comments__action',
                    { transaction },
                ),
                queryInterface.removeConstraint(
                    'action_comments',
                    'fk__action_comments__creator',
                    { transaction },
                ),
                queryInterface.removeConstraint(
                    'action_comments',
                    'fk__action_comments__editor',
                    { transaction },
                ),
            ]);

            await queryInterface.dropTable('action_comments', { transaction });

            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
