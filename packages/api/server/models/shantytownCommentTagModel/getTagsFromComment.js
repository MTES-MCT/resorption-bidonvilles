const sequelize = require('#db/sequelize');
const serializeCommentTag = require('./serializeCommentTag');

module.exports = async (commentIds) => {
    const tags = [];

    const rows = await sequelize.query(
        `SELECT
            CONCAT(sct.fk_shantytown_comment, '-', sct.fk_comment_tag) as "shantytownCommentTagId",
            ct.uid as "tagId",
            ct.tag AS "tagLabel",
            ctt.uid AS "tagTypeId",
            ctt.name AS "tagTypeLabel"
        FROM
            shantytown_comment_tags AS sct
        LEFT JOIN
            comment_tags AS ct
        ON
            ct.uid = sct.fk_comment_tag
        LEFT JOIN
            comment_tag_types AS ctt
        ON
            ctt.uid = ct.fk_comment_tag_type
        WHERE
            fk_shantytown_comment in (:ids)
        ORDER BY 
            "shantytownCommentTagId"`,
        {
            type: sequelize.QueryTypes.SELECT,
            replacements: { ids: commentIds },
        },
    );

    rows.forEach((tag) => {
        tags.push(
            serializeCommentTag(tag),
        );
    }, {});

    return tags;
};
