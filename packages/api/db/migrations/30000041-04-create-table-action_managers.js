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
            fk_user: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
        };
        function addConstraints(table) {
            return [
                queryInterface.addConstraint(table, {
                    fields: ['fk_user'],
                    type: 'foreign key',
                    name: `fk__${table}__user`,
                    references: {
                        table: 'users',
                        field: 'user_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'restrict',
                    transaction,
                }),
            ];
        }

        try {
            // création des tables
            await queryInterface.createTable('action_managers', definition, { transaction });
            await queryInterface.createTable('action_managers_history', definition, { transaction });

            // création des contraintes (clés étrangères)
            await Promise.all([
                ...addConstraints('action_managers'),
                ...addConstraints('action_managers_history'),
                queryInterface.addConstraint('action_managers', {
                    fields: ['fk_action'],
                    type: 'foreign key',
                    name: 'fk__action_managers__action',
                    references: {
                        table: 'actions',
                        field: 'action_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'cascade',
                    transaction,
                }),
                queryInterface.addConstraint('action_managers_history', {
                    fields: ['fk_action'],
                    type: 'foreign key',
                    name: 'fk__action_managers_history__action',
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
                queryInterface.removeConstraint(table, `fk__${table}__user`, { transaction }),
            ];
        }

        try {
            await Promise.all([
                ...removeConstraints('action_managers'),
                ...removeConstraints('action_managers_history'),
                queryInterface.removeConstraint('action_managers', 'fk__action_managers__action', {
                    transaction,
                }),
                queryInterface.removeConstraint('action_managers_history', 'fk__action_managers_history__action', {
                    transaction,
                }),
            ]);

            await Promise.all([
                queryInterface.dropTable('action_managers', { transaction }),
                queryInterface.dropTable('action_managers_history', { transaction }),
            ]);

            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
