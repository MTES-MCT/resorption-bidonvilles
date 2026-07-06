import { sequelize } from '#db/sequelize';

/**
 * @param {Number} commentId L'ID du commentaire à modifier
 * @param {String} description Le nouveau contenu du commentaire
 */
export default async (commentId: number, description: string): Promise<void> => {
    await sequelize.query(
        'UPDATE shantytown_comments SET description = :description, updated_at = NOW() WHERE shantytown_comment_id = :commentId',
        {
            replacements: {
                commentId,
                description,
            },
        },
    );
};
