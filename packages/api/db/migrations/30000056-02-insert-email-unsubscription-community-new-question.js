module.exports = {
    up: queryInterface => queryInterface.sequelize.query(
        `INSERT INTO user_email_unsubscriptions (
            fk_user,
            email_subscription
        )
        SELECT
            user_id,
            'community_new_question'
        FROM users`,
    ),

    down: queryInterface => queryInterface.sequelize.query(
        "DELETE FROM user_email_unsubscriptions WHERE email_subscription = 'community_new_question'",
    ),
};
