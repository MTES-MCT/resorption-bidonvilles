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
            addForeignKeyConstraint(
                queryInterface,
                'shantytown_preparatory_phases_toward_resorption',
                ['fk_shantytown'],
                'fk_shantytown_preparatory_phases_toward_resorption_shantytown',
                {
                    table: 'shantytowns',
                    field: 'shantytown_id',
                },
                transaction,
            ),
            addForeignKeyConstraint(
                queryInterface,
                'shantytown_preparatory_phases_toward_resorption',
                ['fk_preparatory_phase'],
                'shantytown_preparatory_phases_toward_resorption_phase',
                {
                    table: 'preparatory_phases_toward_resorption',
                    field: 'uid',
                },
                transaction,
            ),
        ]);

        await transaction.commit();
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await queryInterface.dropTable('shantytown_preparatory_phases_toward_resorption', { transaction });
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
