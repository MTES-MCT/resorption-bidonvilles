module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        await queryInterface.createTable(
            'user_email_subscriptions',
            {
                user_email_subscription_id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                fk_user: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                email_subscription: {
                    type: Sequelize.ENUM('weekly_summary', 'comment_notification', 'shantytown_closure', 'shantytown_creation'),
                    allowNull: false,
                },
            },
            { transaction },
        );

        await Promise.all([
            queryInterface.addConstraint(
                'user_email_subscriptions', {
                    fields: ['fk_user', 'email_subscription'],
                    type: 'unique',
                    name: 'uk_user_email_subscriptions_user_subscription',
                    transaction,
                },
            ),
            queryInterface.addConstraint(
                'user_email_subscriptions', {
                    fields: ['fk_user'],
                    type: 'foreign key',
                    name: 'fk_user_email_subscriptions_user',
                    references: {
                        table: 'users',
                        field: 'user_id',
                    },
                    onDelete: 'cascade',
                    onUpdate: 'cascade',
                    transaction,
                },
            ),
            queryInterface.addIndex(
                'user_email_subscriptions',
                ['fk_user'],
                { transaction },
            ),
            queryInterface.addIndex(
                'user_email_subscriptions',
                ['email_subscription'],
                { transaction },
            ),
        ]);

        // populate
        const users = await queryInterface.sequelize.query(
            'SELECT user_id, subscribed_to_summary FROM users',
            {
                type: queryInterface.sequelize.QueryTypes.SELECT,
                transaction,
            },
        );

        if (users.length > 0) {
            await queryInterface.bulkInsert(
                'user_email_subscriptions',
                users.map(({ user_id, subscribed_to_summary }) => {
                    const subscriptions = ['comment_notification', 'shantytown_closure', 'shantytown_creation'];
                    if (subscribed_to_summary === true) {
                        subscriptions.push('weekly_summary');
                    }

                    return subscriptions.map(sub => ({
                        fk_user: user_id,
                        email_subscription: sub,
                    }));
                }).flat(),
                { transaction },
            );
        }

        await transaction.commit();
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();
        await Promise.all([
            queryInterface.removeIndex(
                'user_email_subscriptions',
                ['email_subscription'],
                { transaction },
            ),
            queryInterface.removeIndex(
                'user_email_subscriptions',
                ['fk_user'],
                { transaction },
            ),
            queryInterface.removeConstraint(
                'user_email_subscriptions',
                'fk_user_email_subscriptions_user',
                { transaction },
            ),
            queryInterface.removeConstraint(
                'user_email_subscriptions',
                'uk_user_email_subscriptions_user_subscription',
                { transaction },
            ),
        ]);
        await queryInterface.dropTable('user_email_subscriptions', { transaction });

        await transaction.commit();
    },
};
