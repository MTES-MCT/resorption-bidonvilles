const sequelize = require('#db/sequelize');

module.exports = ids => sequelize.query(
    `SELECT
        comment_tags.uid AS uid,
        comment_tags.tag AS label,
        comment_tag_types.name AS type
    FROM
        comment_tags
    LEFT JOIN
        comment_tag_types ON comment_tag_types.uid = comment_tags.fk_comment_tag_type
    WHERE comment_tags.uid IN (:ids)`,
    {
        type: sequelize.QueryTypes.SELECT,
        replacements: {
            ids,
        },
    },
);
