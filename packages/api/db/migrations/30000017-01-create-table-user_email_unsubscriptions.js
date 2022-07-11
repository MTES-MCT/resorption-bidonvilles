module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        await queryInterface.createTable(
            'user_email_unsubscriptions',
            {
                user_email_unsubscription_id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                fk_user: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                email: {
                    type: Sequelize.ENUM('weekly_summary', 'comment_notification', 'shantytown_closure', 'shantytown_creation'),
                    allowNull: false,
                },
            },
            { transaction },
        );

        await Promise.all([
            queryInterface.addConstraint(
                'user_email_unsubscriptions',
                ['fk_user', 'email'],
                {
                    type: 'unique',
                    name: 'uk_user_email_unsubscriptions_user_email',
                    transaction,
                },
            ),
            queryInterface.addConstraint(
                'user_email_unsubscriptions',
                ['fk_user'],
                {
                    type: 'foreign key',
                    name: 'fk_user_email_unsubscriptions_user',
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
                'user_email_unsubscriptions',
                ['fk_user'],
                { transaction },
            ),
            queryInterface.addIndex(
                'user_email_unsubscriptions',
                ['email'],
                { transaction },
            ),
        ]);

        // populate
        const usersUnsubscribedToSummary = await queryInterface.sequelize.query(
            'SELECT user_id FROM users WHERE subscribed_to_summary IS FALSE',
            {
                type: queryInterface.sequelize.QueryTypes.SELECT,
                transaction,
            },
        );

        await queryInterface.bulkInsert(
            'user_email_unsubscriptions',
            usersUnsubscribedToSummary.map(({ user_id }) => ({
                fk_user: user_id,
                email: 'weekly_summary',
            })),
            { transaction },
        );

        await transaction.commit();
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();
        await Promise.all([
            queryInterface.removeIndex(
                'user_email_unsubscriptions',
                ['email'],
                { transaction },
            ),
            queryInterface.removeIndex(
                'user_email_unsubscriptions',
                ['fk_user'],
                { transaction },
            ),
            queryInterface.removeConstraint(
                'user_email_unsubscriptions',
                'fk_user_email_unsubscriptions_user',
                { transaction },
            ),
            queryInterface.removeConstraint(
                'user_email_unsubscriptions',
                'uk_user_email_unsubscriptions_user_email',
                { transaction },
            ),
        ]);
        await queryInterface.dropTable('user_email_unsubscriptions', { transaction });

        await transaction.commit();
    },
};
