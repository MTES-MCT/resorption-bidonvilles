module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        await queryInterface.sequelize.query(
            `DELETE FROM user_webapp_navigation_logs
            WHERE fk_user IN 
                (SELECT user_id
                FROM users
                WHERE to_be_tracked = false
                ) `,
            {
                transaction,
            },
        );

        await queryInterface.sequelize.query(
            `DELETE FROM user_mobile_navigation_logs
            WHERE fk_user IN 
                (SELECT user_id
                FROM users
                WHERE to_be_tracked = false
                ) `,
            {
                transaction,
            },
        );

        return transaction.commit();
    },

    down: () => Promise.resolve(),
};
