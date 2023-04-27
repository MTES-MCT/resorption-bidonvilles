import { sequelize } from '#db/sequelize';

export default async (userId: number, questionId: number, active: boolean): Promise<void> => {
    await sequelize.query(
        'UPDATE user_question_subscriptions SET active = :active, updated_at = NOW() WHERE fk_user = :userId AND fk_question = :questionId',
        {
            replacements: {
                userId,
                questionId,
                active,
            },
        },
    );
};
