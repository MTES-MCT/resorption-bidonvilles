import { sequelize } from '#db/sequelize';

export default async (userId: number, questionId: number): Promise<void> => {
    await sequelize.query(
        `INSERT INTO user_question_subscriptions(fk_user, fk_question, active)
        VALUES (:userId, :questionId, true)`,
        {
            replacements: {
                userId,
                questionId,
            },
        },
    );
};
