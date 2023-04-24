module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        const mapping = await queryInterface.sequelize.query(
            `SELECT * FROM (SELECT
                question_id,
                created_by AS user_id
            FROM questions
            
            UNION
            
            SELECT
                fk_question AS question_id,
                created_by AS user_id
            FROM answers) t
            GROUP BY question_id, user_id`,
            {
                type: queryInterface.sequelize.QueryTypes.SELECT,
                transaction,
            },
        );

        await queryInterface.bulkInsert(
            'user_question_subscriptions',
            mapping.map(({ question_id, user_id }) => ({
                fk_user: user_id,
                fk_question: question_id,
                active: true,
            })),
            { transaction },
        );

        await transaction.commit();
    },

    down: queryInterface => queryInterface.bulkDelete('user_question_subscriptions', {}),
};
