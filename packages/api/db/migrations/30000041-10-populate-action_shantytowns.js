// actions
module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await queryInterface.sequelize.query(
                `
                INSERT INTO action_shantytowns(
                    fk_action,
                    fk_shantytown
                )

                SELECT
                    fk_plan,
                    fk_shantytown
                FROM plan_shantytowns
            `,
                {
                    transaction,
                },
            );
            await queryInterface.sequelize.query(
                `
                INSERT INTO action_shantytowns_history(
                    fk_action,
                    fk_shantytown
                )

                SELECT
                    plans_history.hid,
                    plan_shantytowns.fk_shantytown
                FROM plans_history
                LEFT JOIN plans2 ON plans_history.plan_id = plans2.plan_id
                LEFT JOIN plan_shantytowns ON plan_shantytowns.fk_plan = plans2.plan_id
                WHERE plan_shantytowns.fk_plan IS NOT NULL
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
                    'DELETE FROM action_shantytowns_history',
                    { transaction },
                ),
                queryInterface.sequelize.query(
                    'DELETE FROM action_shantytowns',
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
