import { sequelize } from '#db/sequelize';

/**
 * @param {Number} id A shantytown_comment_id
 */
export default async (commentId) => {
    sequelize.query(
        'DELETE FROM shantytown_comments WHERE shantytown_comment_id = :id',
        {
            replacements: {
                id: commentId,
            },
        },
    );
};
