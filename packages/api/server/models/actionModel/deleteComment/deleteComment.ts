import { sequelize } from '#db/sequelize';
import { Transaction } from 'sequelize';

export default async (commentId: number, transaction?: Transaction): Promise<void> => {
    const response = sequelize.query(
        'DELETE FROM action_comments WHERE action_comment_id = :id',
        {
            transaction,
            replacements: {
                id: commentId,
            },
        },
    );

    const rowCount: number = response[0] as unknown as number;
    if (rowCount === 0) {
        throw new Error(`Comment ${commentId} introuvable`);
    }
};
