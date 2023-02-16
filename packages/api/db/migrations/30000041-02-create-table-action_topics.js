// actions
module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        const definition = {
            fk_action: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            fk_topic: {
                type: Sequelize.STRING,
                allowNull: false,
                primaryKey: true,
            },
        };
        function addConstraints(table) {
            return [
                queryInterface.addConstraint(table, {
                    fields: ['fk_topic'],
                    type: 'foreign key',
                    name: `fk__${table}__topic`,
                    references: {
                        table: 'topics',
                        field: 'uid',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'restrict',
                    transaction,
                }),
            ];
        }

        try {
            // création des tables
            await queryInterface.createTable('action_topics', definition, { transaction });
            await queryInterface.createTable('action_topics_history', definition, { transaction });

            // création des contraintes (clés étrangères)
            await Promise.all([
                ...addConstraints('action_topics'),
                ...addConstraints('action_topics_history'),
                queryInterface.addConstraint('action_topics', {
                    fields: ['fk_action'],
                    type: 'foreign key',
                    name: 'fk__action_topics__action',
                    references: {
                        table: 'actions',
                        field: 'action_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'cascade',
                    transaction,
                }),
                queryInterface.addConstraint('action_topics_history', {
                    fields: ['fk_action'],
                    type: 'foreign key',
                    name: 'fk__action_topics_history__action',
                    references: {
                        table: 'actions_history',
                        field: 'hid',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'cascade',
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
        function removeConstraints(table) {
            return [
                queryInterface.removeConstraint(table, `fk__${table}__topic`, { transaction }),
            ];
        }

        try {
            await Promise.all([
                ...removeConstraints('action_topics'),
                ...removeConstraints('action_topics_history'),
                queryInterface.removeConstraint('action_topics', 'fk__action_topics__action', {
                    transaction,
                }),
                queryInterface.removeConstraint('action_topics_history', 'fk__action_topics_history__action', {
                    transaction,
                }),
            ]);

            await Promise.all([
                queryInterface.dropTable('action_topics', { transaction }),
                queryInterface.dropTable('action_topics_history', { transaction }),
            ]);

            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
