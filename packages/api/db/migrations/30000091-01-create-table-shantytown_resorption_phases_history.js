function addForeignKeyConstraint(queryInterface, tableName, fields, name, references, transaction) {
    return queryInterface.addConstraint(
        tableName,
        {
            fields,
            type: 'foreign key',
            name,
            references,
            onUpdate: 'cascade',
            onDelete: 'cascade',
            transaction,
        },
    );
}

module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            const definition = {
                fk_shantytown: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                fk_preparatory_phase: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    primaryKey: true,
                },
                created_at: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                },
                completed_at: {
                    type: Sequelize.DATE,
                    allowNull: true,
                },
            };

            await queryInterface.createTable(
                'shantytown_resorption_phases_history',
                {
                    ...definition,
                    archived_at: {
                        type: Sequelize.DATE,
                        allowNull: false,
                        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                    },
                },
                { transaction },
            );

            await Promise.all([
                addForeignKeyConstraint(
                    queryInterface,
                    'shantytown_resorption_phases_history',
                    ['fk_shantytown'],
                    'fk_shantytown_resorption_phases_history_shantytown',
                    { table: 'ShantytownHistories', field: 'hid' },
                    transaction,
                ),
                addForeignKeyConstraint(
                    queryInterface,
                    'shantytown_resorption_phases_history',
                    ['fk_preparatory_phase'],
                    'fk_shantytown_resorption_phases_history_phase',
                    { table: 'preparatory_phases_toward_resorption', field: 'uid' },
                    transaction,
                ),
            ]);

            await transaction.commit();
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
                    'shantytown_resorption_phases_history',
                    'fk_shantytown_resorption_phases_history_shantytown',
                    { transaction },
                ),
                queryInterface.removeConstraint(
                    'shantytown_resorption_phases_history',
                    'fk_shantytown_resorption_phases_history_phase',
                    { transaction },
                ),
            ]);

            await queryInterface.dropTable('shantytown_resorption_phases_history', { transaction });
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
