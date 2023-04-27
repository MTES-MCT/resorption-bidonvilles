module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
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

            if (mapping.length > 0) {
                await queryInterface.bulkInsert(
                    'user_question_subscriptions',
                    mapping.map(({ question_id, user_id }) => ({
                        fk_user: user_id,
                        fk_question: question_id,
                        active: true,
                    })),
                    { transaction },
                );
            }

            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    },

    down: queryInterface => queryInterface.bulkDelete('user_question_subscriptions', {}),
};
