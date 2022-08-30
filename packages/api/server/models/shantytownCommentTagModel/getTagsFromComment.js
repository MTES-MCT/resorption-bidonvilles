const sequelize = require('#db/sequelize');
const serializeCommentTag = require('./serializeCommentTag');

module.exports = async (commentId) => {
    const rows = await sequelize.query(
        `SELECT
            ct.uid,
            ct.tag
        FROM shantytown_comment_tags AS sct
        LEFT JOIN comment_tags AS ct ON ct.uid = sct.fk_comment_tag
        WHERE sct.fk_shantytown_comment = :id
        ORDER BY CONCAT(sct.fk_shantytown_comment, '-', sct.fk_comment_tag) ASC`,
        {
            type: sequelize.QueryTypes.SELECT,
            replacements: { id: commentId },
        },
    );

    return rows.map(serializeCommentTag);
};
