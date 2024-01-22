import { Transaction, QueryTypes } from 'sequelize';
import { sequelize } from '#db/sequelize';

/**
 * @param {Number} commentId
 */
export default async (commentId: number, transaction: Transaction): Promise<void> => {
    await sequelize.query(
        'DELETE FROM shantytown_comments WHERE shantytown_comment_id = :id',
        {
            type: QueryTypes.DELETE,
            replacements: {
                id: commentId,
            },
            transaction,
        },
    );
};
