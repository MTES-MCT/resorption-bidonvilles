import { sequelize } from '#db/sequelize';
import { Transaction } from 'sequelize';

/**
 * @param {Number} id A fk_shantytown_comment
 */
export default async (commentId, transaction: Transaction = undefined) => {
    await sequelize.query(
        'DELETE FROM shantytown_comment_attachments WHERE fk_shantytown_comment = :id',
        {
            replacements: {
                id: commentId,
            },
            transaction,
        },
    );
};
