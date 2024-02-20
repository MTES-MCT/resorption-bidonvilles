module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        // rename table and constraints
        await Promise.all([
            queryInterface.sequelize.query(
                `ALTER TABLE user_email_subscriptions
                RENAME CONSTRAINT uk_user_email_subscriptions_user_subscription
                                TO uk_user_email_unsubscriptions_user_subscription`,
                { transaction },
            ),
            queryInterface.sequelize.query(
                `     ALTER TABLE user_email_subscriptions
                RENAME CONSTRAINT fk_user_email_subscriptions_user
                                TO fk_user_email_unsubscriptions_user`,
                { transaction },
            ),
        ]);
        await queryInterface.sequelize.query(
            'ALTER TABLE user_email_subscriptions RENAME TO user_email_unsubscriptions',
            { transaction },
        );

        // convert subscriptions into unsubscriptions
        const subscriptions = await queryInterface.sequelize.query(
            `  SELECT u.user_id,
                    array_agg(ueu.email_subscription) AS subs
                FROM users u
        LEFT JOIN user_email_unsubscriptions ueu ON ueu.fk_user = u.user_id
            WHERE ueu.fk_user IS NOT NULL
            GROUP BY u.user_id`,
            {
                type: queryInterface.sequelize.QueryTypes.SELECT,
                transaction,
            },
        );
        await queryInterface.sequelize.query(
            'DELETE FROM user_email_unsubscriptions',
            { transaction },
        );

        if (subscriptions.length > 0) {
            await queryInterface.bulkInsert(
                'user_email_unsubscriptions',
                subscriptions.map(
                    ({ user_id, subs }) => ['weekly_summary', 'comment_notification', 'shantytown_closure', 'shantytown_creation']
                        .filter(sub => !subs.includes(sub))
                        .map(sub => ({
                            fk_user: user_id,
                            email_subscription: sub,
                        })),
                ).flat(),
                { transaction },
            );
        }

        await transaction.commit();
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        // rename table and constraints
        await Promise.all([
            queryInterface.sequelize.query(
                `     ALTER TABLE user_email_unsubscriptions
                RENAME CONSTRAINT uk_user_email_unsubscriptions_user_subscription
                                TO uk_user_email_subscriptions_user_subscription`,
                { transaction },
            ),
            queryInterface.sequelize.query(
                `     ALTER TABLE user_email_unsubscriptions
                RENAME CONSTRAINT fk_user_email_unsubscriptions_user
                                TO fk_user_email_subscriptions_user`,
                { transaction },
            ),
        ]);
        await queryInterface.sequelize.query(
            'ALTER TABLE user_email_unsubscriptions RENAME TO user_email_subscriptions',
            { transaction },
        );

        // convert unsubscriptions into subscriptions
        const subscriptions = await queryInterface.sequelize.query(
            `  SELECT u.user_id,
                    array_agg(ues.email_subscription) AS subs
                FROM users u
        LEFT JOIN user_email_subscriptions ues ON ues.fk_user = u.user_id
            GROUP BY u.user_id`,
            {
                type: queryInterface.sequelize.QueryTypes.SELECT,
                transaction,
            },
        );
        await queryInterface.sequelize.query(
            'DELETE FROM user_email_subscriptions',
            { transaction },
        );

        await queryInterface.bulkInsert(
            'user_email_subscriptions',
            subscriptions.map(
                ({ user_id, subs }) => ['weekly_summary', 'comment_notification', 'shantytown_closure', 'shantytown_creation']
                    .filter(sub => !subs.includes(sub))
                    .map(sub => ({
                        fk_user: user_id,
                        email_subscription: sub,
                    })),
            ).flat(),
            { transaction },
        );

        await transaction.commit();
    },
};
