import { QueryTypes } from 'sequelize';
import { sequelize } from '#db/sequelize';

type QuestionSubscriberRow = {
    user_id: number,
    email: string,
    first_name: string,
    last_name: string,
    is_author: boolean,
};

export default (questionId: number): Promise<QuestionSubscriberRow[]> => sequelize.query(
    `SELECT
        u.user_id,
        u.email,
        u.first_name,
        u.last_name,
        u.user_id = q.created_by AS is_author
    FROM user_question_subscriptions uqs
    LEFT JOIN questions q ON uqs.fk_question = q.question_id
    LEFT JOIN users u ON uqs.fk_user = u.user_id
    WHERE uqs.fk_question = :questionId AND uqs.active IS TRUE
    `,
    {
        type: QueryTypes.SELECT,
        replacements: {
            questionId,
        },
    },
);
