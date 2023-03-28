module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await queryInterface.sequelize.query(
                `INSERT INTO user_email_unsubscriptions (
                    fk_user,
                    email_subscription
                )
                SELECT
                    user_id,
                    'community_new_question'
                FROM 
                    users
                WHERE
                    fk_status = 'active'`,
                { transaction },
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
            await queryInterface.sequelize.query(
                "DELETE FROM user_email_unsubscriptions WHERE email_subscription = 'community_new_question'",
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

};
