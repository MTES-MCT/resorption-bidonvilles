import { sequelize } from '#db/sequelize';
import { Transaction } from 'sequelize';

const update = async (commentId: number, userId: number, description: string, transaction: Transaction = undefined): Promise<{ shantytown_comment_id: number }[]> => {
    const [results]: [any[], any] = await sequelize.query(
        `UPDATE shantytown_comments
         SET
            description = :description,
            updated_at = NOW(),
            updated_by = :userId
         WHERE shantytown_comment_id = :commentId
            AND created_by = :userId
         RETURNING shantytown_comment_id`,
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

export default update;
