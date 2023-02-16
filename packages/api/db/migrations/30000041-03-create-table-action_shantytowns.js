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
            fk_shantytown: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
        };
        function addConstraints(table) {
            return [
                queryInterface.addConstraint(table, {
                    fields: ['fk_shantytown'],
                    type: 'foreign key',
                    name: `fk__${table}__shantytown`,
                    references: {
                        table: 'shantytowns',
                        field: 'shantytown_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'restrict',
                    transaction,
                }),
            ];
        }

        try {
            // création des tables
            await queryInterface.createTable('action_shantytowns', definition, { transaction });
            await queryInterface.createTable('action_shantytowns_history', definition, { transaction });

            // création des contraintes (clés étrangères)
            await Promise.all([
                ...addConstraints('action_shantytowns'),
                ...addConstraints('action_shantytowns_history'),
                queryInterface.addConstraint('action_shantytowns', {
                    fields: ['fk_action'],
                    type: 'foreign key',
                    name: 'fk__action_shantytowns__action',
                    references: {
                        table: 'actions',
                        field: 'action_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'cascade',
                    transaction,
                }),
                queryInterface.addConstraint('action_shantytowns_history', {
                    fields: ['fk_action'],
                    type: 'foreign key',
                    name: 'fk__action_shantytowns_history__action',
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
                queryInterface.removeConstraint(table, `fk__${table}__shantytown`, { transaction }),
            ];
        }

        try {
            await Promise.all([
                ...removeConstraints('action_shantytowns'),
                ...removeConstraints('action_shantytowns_history'),
                queryInterface.removeConstraint('action_shantytowns', 'fk__action_shantytowns__action', {
                    transaction,
                }),
                queryInterface.removeConstraint('action_shantytowns_history', 'fk__action_shantytowns_history__action', {
                    transaction,
                }),
            ]);

            await Promise.all([
                queryInterface.dropTable('action_shantytowns', { transaction }),
                queryInterface.dropTable('action_shantytowns_history', { transaction }),
            ]);

            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
