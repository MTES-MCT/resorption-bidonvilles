module.exports = {
    up: queryInterface => queryInterface.sequelize.query(
        "ALTER TYPE enum_user_email_subscriptions_email_subscription ADD VALUE 'community_new_answer'",
    ),

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await Promise.all([
                queryInterface.sequelize.query(
                    "DELETE FROM user_email_unsubscriptions WHERE email_subscription = 'community_new_answer'",
                    {
                        transaction,
                    },
                ),

                queryInterface.sequelize.query(
                    `CREATE TYPE enum_user_email_subscriptions_email_subscription_new AS ENUM ('weekly_summary', 'comment_notification', 
                        'action_comment_notification', 'shantytown_closure', 'shantytown_creation')`,
                    {
                        transaction,
                    },
                ),
                queryInterface.sequelize.query(
                    `ALTER TABLE user_email_unsubscriptions
                        ALTER COLUMN email_subscription TYPE enum_user_email_subscriptions_email_subscription_new
                        USING (email_subscription::text::enum_user_email_subscriptions_email_subscription_new)`,
                    {
                        transaction,
                    },
                ),
                queryInterface.sequelize.query(
                    'DROP TYPE enum_user_email_subscriptions_email_subscription',
                    {
                        transaction,
                    },
                ),
                queryInterface.sequelize.query(
                    'ALTER TYPE enum_user_email_subscriptions_email_subscription_new RENAME TO enum_user_email_subscriptions_email_subscription',
                    {
                        transaction,
                    },
                ),
            ]);

            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

};
