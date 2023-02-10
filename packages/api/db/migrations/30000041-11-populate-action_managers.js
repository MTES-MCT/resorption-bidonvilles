// actions
module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await queryInterface.sequelize.query(
                `
                INSERT INTO action_managers(
                    fk_action,
                    fk_user
                )

                SELECT
                    fk_plan,
                    fk_user
                FROM plan_managers
            `,
                {
                    transaction,
                },
            );
            await queryInterface.sequelize.query(
                `
                INSERT INTO action_managers_history(
                    fk_action,
                    fk_user
                )

                SELECT
                    fk_plan,
                    fk_user
                FROM plan_managers_history
            `,
                {
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
            await Promise.all([
                queryInterface.sequelize.query(
                    'DELETE FROM action_managers_history',
                    { transaction },
                ),
                queryInterface.sequelize.query(
                    'DELETE FROM action_managers',
                    { transaction },
                ),
            ]);

            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
