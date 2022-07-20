module.exports = {
    up(queryInterface) {
        return queryInterface.removeColumn(
            'users',
            'subscribed_to_summary',
        );
    },

    async down(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        const [usersSubscribedToSummary] = await Promise.all([
            queryInterface.sequelize.query(
                'SELECT fk_user FROM user_email_subscriptions WHERE email_subscription = \'weekly_summary\'',
                {
                    type: queryInterface.sequelize.QueryTypes.SELECT,
                    transaction,
                },
            ),
            queryInterface.addColumn(
                'users',
                'subscribed_to_summary',
                {
                    type: Sequelize.BOOLEAN,
                    allowNull: false,
                    defaultValue: true,
                },
                { transaction },
            ),
        ]);

        await queryInterface.sequelize.query(
            'UPDATE users SET subscribed_to_summary = FALSE WHERE user_id NOT IN (:userIds)',
            {
                replacements: {
                    userIds: usersSubscribedToSummary.map(({ fk_user }) => fk_user),
                },
                transaction,
            },
        );

        await transaction.commit();
    },
};
