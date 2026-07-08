import { sequelize } from '#db/sequelize';
import { Transaction } from 'sequelize';

const updateComment = async (commentId: number, userId: number, description: string, transaction: Transaction = undefined): Promise<{ action_comment_id: number }[]> => {
    const [results]: [any[], any] = await sequelize.query(
        `UPDATE action_comments
         SET
            description = :description,
            updated_at = NOW(),
            updated_by = :userId
         WHERE action_comment_id = :commentId
            AND created_by = :userId
         RETURNING action_comment_id`,
        {
            replacements: {
                commentId,
                userId,
                description,
            },
            transaction,
        },
    );

    return results;
};

export default updateComment;
