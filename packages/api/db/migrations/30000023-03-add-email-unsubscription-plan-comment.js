module.exports = {
    async up(queryInterface) {
        await queryInterface.sequelize.query(
            "ALTER TYPE enum_user_email_subscriptions_email_subscription ADD VALUE 'plan_comment_notification'",
        );
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        await Promise.all(
            [
                queryInterface.sequelize.query(
                    "DELETE FROM user_email_unsubscriptions WHERE email_subscription = 'plan_comment_notification'",
                    {
                        transaction,
                    },
                ),

                queryInterface.sequelize.query(
                    "CREATE TYPE enum_user_email_subscriptions_email_subscription_new AS ENUM ('weekly_summary', 'comment_notification', 'shantytown_closure', 'shantytown_creation')",
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
            ],
        );

        await transaction.commit();
    },

};
