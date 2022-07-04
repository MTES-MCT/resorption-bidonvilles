const sequelize = require('#db/sequelize');

module.exports = async (fk_comment_tag_type) => {
    const commentTags = await sequelize.query(
        `SELECT
            comment_tags.uid AS uid,
            comment_tags.tag AS label,
            comment_tag_types.name AS type
        FROM
            comment_tags
        LEFT JOIN
            comment_tag_types ON comment_tag_types.uid = comment_tags.fk_comment_tag_type
        WHERE
            fk_comment_tag_type = :fk_comment_tag_type`,
        {
            type: sequelize.QueryTypes.SELECT,
            replacements: {
                fk_comment_tag_type,
            },
        },
    );

    return commentTags.length > 0 ? commentTags : null;
};
