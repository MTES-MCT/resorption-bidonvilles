import { sequelize } from '#db/sequelize';

/**
 * @param {Number} commentId
 */
export default async (commentId: number): Promise<void> => {
    await sequelize.query(
        'DELETE FROM shantytown_comments WHERE shantytown_comment_id = :id',
        {
            replacements: {
                id: commentId,
            },
        },
    );
};
