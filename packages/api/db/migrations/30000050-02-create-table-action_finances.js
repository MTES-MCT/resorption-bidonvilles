// actions
module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        function addConstraints(table) {
            return [
                queryInterface.addConstraint(table, {
                    fields: ['fk_action_finance_type'],
                    type: 'foreign key',
                    name: `fk__${table}__type`,
                    references: {
                        table: 'action_finance_types',
                        field: 'uid',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'restrict',
                    transaction,
                }),
            ];
        }

        try {
            const definition = {
                fk_action: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                year: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                fk_action_finance_type: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                amount: {
                    type: Sequelize.DOUBLE,
                    allowNull: true,
                },
                real_amount: {
                    type: Sequelize.DOUBLE,
                    allowNull: true,
                },
                comments: {
                    type: Sequelize.TEXT,
                    allowNull: true,
                },
            };

            // création des tables
            await queryInterface.createTable(
                'action_finances',
                {
                    ...definition,
                },
                {
                    transaction,
                },
            );

            await queryInterface.createTable(
                'action_finances_history',
                {
                    ...definition,
                },
                {
                    transaction,
                },
            );

            // création des contraintes (clés étrangères, checks...)
            await Promise.all([
                ...addConstraints('action_finances'),
                queryInterface.addConstraint('action_finances', {
                    fields: ['fk_action'],
                    type: 'foreign key',
                    name: 'fk__action_finance__action',
                    references: {
                        table: 'actions',
                        field: 'action_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'cascade',
                    transaction,
                }),
                ...addConstraints('action_finances_history'),
                queryInterface.addConstraint('action_finances_history', {
                    fields: ['fk_action'],
                    type: 'foreign key',
                    name: 'fk__action_finance_history__action',
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
                queryInterface.removeConstraint(table, `fk__${table}__type`, { transaction }),
                queryInterface.removeConstraint(table, `fk__${table}__author`, { transaction }),
            ];
        }
        try {
            await Promise.all([
                ...removeConstraints('action_finances'),
                queryInterface.removeConstraint(
                    'action_finances',
                    'fk__action_finance__action',
                    { transaction },
                ),
                ...removeConstraints('action_finances_history'),
                queryInterface.removeConstraint(
                    'action_finances_history',
                    'fk__action_finance_history__action',
                    { transaction },
                ),
            ]);

            await queryInterface.dropTable('action_finances', { transaction });
            await queryInterface.dropTable('action_finances_history', { transaction });

            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
