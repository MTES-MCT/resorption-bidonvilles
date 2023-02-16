// actions
module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await queryInterface.sequelize.query(
                `
                INSERT INTO action_operators(
                    fk_action,
                    fk_user
                )

                SELECT
                    fk_plan,
                    fk_user
                FROM plan_operators
            `,
                {
                    transaction,
                },
            );
            await queryInterface.sequelize.query(
                `
                INSERT INTO action_operators_history(
                    fk_action,
                    fk_user
                )

                SELECT
                    plans_history.hid,
                    plan_operators.fk_user
                FROM plans_history
                LEFT JOIN plans2 ON plans_history.plan_id = plans2.plan_id
                LEFT JOIN plan_operators ON plan_operators.fk_plan = plans2.plan_id
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
                    'DELETE FROM action_operators_history',
                    { transaction },
                ),
                queryInterface.sequelize.query(
                    'DELETE FROM action_operators',
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
