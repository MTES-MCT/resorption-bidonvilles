module.exports = {
    up: queryInterface => queryInterface.sequelize.query(
        "ALTER TYPE enum_user_email_subscriptions_email_subscription RENAME VALUE 'plan_comment_notification' TO 'action_comment_notification'",
    ),

    down: queryInterface => queryInterface.sequelize.query(
        "ALTER TYPE enum_user_email_subscriptions_email_subscription RENAME VALUE 'action_comment_notification' TO 'plan_comment_notification'",
    ),
};
