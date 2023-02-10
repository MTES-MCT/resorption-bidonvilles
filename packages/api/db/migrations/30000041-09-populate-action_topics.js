// actions
module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await queryInterface.sequelize.query(
                `
                INSERT INTO action_topics(
                    fk_action,
                    fk_topic
                )

                SELECT
                    fk_plan,
                    fk_topic
                FROM plan_topics
            `,
                {
                    transaction,
                },
            );
            await queryInterface.sequelize.query(
                `
                INSERT INTO action_topics_history(
                    fk_action,
                    fk_topic
                )

                SELECT
                    plans_history.hid,
                    plan_topics.fk_topic
                FROM plans_history
                LEFT JOIN plans2 ON plans_history.plan_id = plans2.plan_id
                LEFT JOIN plan_topics ON plan_topics.fk_plan = plans2.plan_id
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
                    'DELETE FROM action_topics_history',
                    { transaction },
                ),
                queryInterface.sequelize.query(
                    'DELETE FROM action_topics',
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
