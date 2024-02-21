module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await queryInterface.addColumn(
                'organization_types',
                'created_by',
                {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                { transaction },
            );
            await queryInterface.addConstraint('organization_types', {
                fields: ['created_by'],
                type: 'foreign key',
                name: 'fk_organization_types_created_by',
                references: {
                    table: 'users',
                    field: 'user_id',
                },
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE',
                transaction,
            });

            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await queryInterface.removeConstraint('organization_types', 'fk_organization_types_created_by', { transaction });
            await queryInterface.removeColumn(
                'organization_types',
                'created_by',
                { transaction },
            );

            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
