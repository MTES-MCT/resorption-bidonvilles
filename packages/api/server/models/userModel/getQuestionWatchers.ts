import { QueryTypes } from 'sequelize';
import { sequelize } from '#db/sequelize';

type QuestionWatcherRow = {
    user_id: number,
    email: string,
    first_name: string,
    last_name: string,
};

export default (authorId: number): Promise<QuestionWatcherRow[]> => sequelize.query(
    `SELECT
        u.user_id,
        u.email,
        u.first_name,
        u.last_name
    FROM users u
    LEFT JOIN user_email_unsubscriptions ueu ON ueu.fk_user = u.user_id AND email_subscription = 'community_new_question'
    WHERE u.fk_status = 'active' AND u.user_id != :authorId AND ueu.user_email_subscription_id IS NULL
    `,
    {
        type: QueryTypes.SELECT,
        replacements: {
            authorId,
        },
    },
);
