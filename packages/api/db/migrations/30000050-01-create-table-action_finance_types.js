module.exports = {

    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            // création des tables
            await queryInterface.createTable(
                'action_finance_types',
                {
                    uid: {
                        type: Sequelize.STRING,
                        allowNull: false,
                        primaryKey: true,
                    },
                    name: {
                        type: Sequelize.STRING,
                        allowNull: false,
                    },
                },
                {
                    transaction,
                },
            );
            await queryInterface.addConstraint('action_finance_types', {
                fields: ['name'],
                type: 'unique',
                name: 'uk_action_finance_types_name',
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
            await queryInterface.removeConstraint(
                'action_finance_types',
                'uk_action_finance_types_name',
                {
                    transaction,
                },
            );
            await queryInterface.dropTable('action_finance_types', { transaction });
            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
