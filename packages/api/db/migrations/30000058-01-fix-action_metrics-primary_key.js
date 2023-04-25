// actions
module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await queryInterface.removeConstraint(
                'action_metrics',
                'action_metrics_pkey',
                { transaction },
            );
            await queryInterface.addConstraint(
                'action_metrics', {
                    fields: ['fk_action', 'date', 'created_at'],
                    type: 'primary key',
                    name: 'action_metrics_pkey',
                    transaction,
                },
            );

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
                'action_metrics',
                'action_metrics_pkey',
                { transaction },
            );
            await queryInterface.addConstraint(
                'action_metrics', {
                    fields: ['fk_action', 'created_at'],
                    type: 'primary key',
                    name: 'action_metrics_pkey',
                    transaction,
                },
            );

            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
