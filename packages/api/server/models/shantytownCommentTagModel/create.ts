import { sequelize } from '#db/sequelize';

/**
 * @param {Number} commentId
 * @param {String} commentTagId
 * @returns
 */
export default (commentId, commentTagIds, transaction = undefined) => sequelize.getQueryInterface().bulkInsert(
    'shantytown_comment_tags',
    commentTagIds.map(comment_tag_id => ({
        fk_shantytown_comment: commentId,
        fk_comment_tag: comment_tag_id,
    })),
    {
        transaction,
    },
);
