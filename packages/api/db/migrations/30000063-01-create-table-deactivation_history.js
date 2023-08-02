module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await queryInterface.createTable(
                'user_deactivation_history',
                {
                    fk_user: {
                        type: Sequelize.INTEGER,
                        allowNull: false,
                        primaryKey: true,
                    },
                    deactivated_at: {
                        type: Sequelize.DATE,
                        allowNull: false,
                        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                    },

                },
                {
                    transaction,
                },
            );
            await queryInterface.addConstraint('user_deactivation_history', {
                fields: ['fk_user'],
                type: 'foreign key',
                name: 'fk_user_user_deactivation_history',
                references: {
                    table: 'users',
                    field: 'user_id',
                },
                onUpdate: 'cascade',
                onDelete: 'cascade',
                transaction,
            });


            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await queryInterface.removeConstraint('user_deactivation_history', 'fk_user_user_deactivation_history', { transaction });
            await queryInterface.dropTable('user_deactivation_history', { transaction });

            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    },
};
