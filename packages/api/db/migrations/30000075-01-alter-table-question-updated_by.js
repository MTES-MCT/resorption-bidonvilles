module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await queryInterface.addColumn(
                'questions',
                'updated_by',
                {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                    defaultValue: null,
                },
                { transaction },
            );

            await queryInterface.addConstraint('questions', {
                fields: ['updated_by'],
                name: 'fk_questions_updated_by',
                type: 'foreign key',
                references: {
                    table: 'users',
                    field: 'user_id',
                },
                onDelete: 'cascade',
                onUpdate: 'cascade',
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
            await queryInterface.removeConstraint('questions', 'fk_questions_updated_by', { transaction });

            await queryInterface.removeColumn(
                'questions',
                'updated_by',
                { transaction },
            );

            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
