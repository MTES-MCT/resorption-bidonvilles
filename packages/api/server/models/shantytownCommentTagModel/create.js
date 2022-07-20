const sequelize = require('#db/sequelize');

/**
 * @param {Number} commentId
 * @param {String} commentTagId
 * @returns
 */
module.exports = async (commentId, commentTagIds, argTransaction = undefined) => {
    let transaction = argTransaction;
    if (transaction === undefined) {
        transaction = await sequelize.transaction();
    }
    await sequelize.getQueryInterface().bulkInsert(
        'shantytown_comment_tags',
        commentTagIds.map(comment_tag_id => ({
            fk_shantytown_comment: commentId,
            fk_comment_tag: comment_tag_id,
        })),
        {
            transaction,
        },
    );
};
