module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await queryInterface.addColumn(
                'organizations',
                'created_by',
                {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                { transaction },
            );
            await queryInterface.addConstraint('organizations', {
                fields: ['created_by'],
                type: 'foreign key',
                name: 'fk_organizations_created_by',
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
            await queryInterface.removeConstraint('organizations', 'fk_organizations_created_by', { transaction });
            await queryInterface.removeColumn(
                'organizations',
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
