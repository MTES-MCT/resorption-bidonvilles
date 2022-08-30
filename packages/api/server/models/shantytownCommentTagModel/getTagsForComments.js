const sequelize = require('#db/sequelize');
const serializeCommentTag = require('./serializeCommentTag');

module.exports = async (commentIds) => {
    // fetch all tags
    const rows = await sequelize.query(
        `SELECT
            sct.fk_shantytown_comment AS commentId,
            ct.uid,
            ct.tag
        FROM shantytown_comment_tags AS sct
        LEFT JOIN comment_tags AS ct ON ct.uid = sct.fk_comment_tag
        WHERE sct.fk_shantytown_comment IN (:ids)
        ORDER BY CONCAT(sct.fk_shantytown_comment, '-', sct.fk_comment_tag) ASC`,
        {
            type: sequelize.QueryTypes.SELECT,
            replacements: { ids: commentIds },
        },
    );

    // group tags by comment (empty array is the default for each comment)
    const tags = commentIds.reduce((acc, commentId) => ({
        ...acc,
        [parseInt(commentId, 10)]: [],
    }), {});

    return rows.reduce((argAcc, tag) => {
        const acc = { ...argAcc };
        acc[tag.commentId].push(serializeCommentTag(tag));

        return acc;
    }, tags);
};
