module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        await queryInterface.createTable(
            'shantytown_preparatory_phases_toward_resorption',
            {
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
                created_by: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
            },
            {
                transaction,
            },
        );


        await Promise.all([
            queryInterface.addConstraint(
                'shantytown_preparatory_phases_toward_resorption', {
                    fields: ['fk_shantytown'],
                    type: 'foreign key',
                    name: 'fk_shantytown_preparatory_phases_toward_resorption_shantytown',
                    references: {
                        table: 'shantytowns',
                        field: 'shantytown_id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'cascade',
                    transaction,
                },
            ),
            queryInterface.addConstraint(
                'shantytown_preparatory_phases_toward_resorption', {
                    fields: ['fk_preparatory_phase'],
                    type: 'foreign key',
                    name: 'fk_shantytown_preparatory_phases_toward_resorption_phase',
                    references: {
                        table: 'preparatory_phases_toward_resorption',
                        field: 'uid',
                    },
                    onUpdate: 'cascade',
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
            queryInterface.removeConstraint(
                'shantytown_preparatory_phases_toward_resorption',
                'fk_shantytown_preparatory_phases_toward_resorption_shantytown',
                {
                    transaction,
                },
            ),
            queryInterface.removeConstraint(
                'shantytown_preparatory_phases_toward_resorption',
                'fk_shantytown_preparatory_phases_toward_resorption_phase',
                {
                    transaction,
                },
            ),
        ]);
        await queryInterface.dropTable('shantytown_preparatory_phases_toward_resorption', { transaction });
        return transaction.commit();
    },
};
