import { sequelize } from '#db/sequelize';
import { QueryTypes, Transaction } from 'sequelize';

export default async (commentId: number, userId: number, description: string, transaction: Transaction = undefined): Promise<void> => {
    await sequelize.query(
        `UPDATE action_comments
         SET
            description = :description,
            updated_at = NOW(),
            updated_by = :userId
         WHERE action_comment_id = :commentId`,
        {
            type: QueryTypes.UPDATE,
            replacements: {
                commentId,
                userId,
                description,
            },
            transaction,
        },
    );
};
