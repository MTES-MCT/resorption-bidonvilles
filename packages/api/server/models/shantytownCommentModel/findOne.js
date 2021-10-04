const { sequelize } = require('#db/models');
const { serializeComment } = require('#server/models/shantytownModel')(sequelize);

/**
 * @param {Number} id A shantytown_comment_id
 */
module.exports = async (id) => {
    const rows = await sequelize.query(
        `SELECT
            sc.shantytown_comment_id AS "commentId",
            sc.description AS "commentDescription",
            sc.fk_shantytown AS "shantytownId",
            sc.created_at AS "commentCreatedAt",
            sc.created_by "commentCreatedBy",
            sc.private AS "commentPrivate",
            u.first_name AS "userFirstName",
            u.last_name AS "userLastName",
            u.position AS "userPosition",
            o.abbreviation AS "organizationAbbreviation",
            o.name AS "organizationName",
            o.organization_id AS "organizationId"
        FROM
            shantytown_comments sc
        LEFT JOIN
            users u ON sc.created_by = u.user_id
        LEFT JOIN
            organizations o ON u.fk_organization = o.organization_id
        WHERE
            sc.shantytown_comment_id = :id`,
        {
            type: sequelize.QueryTypes.SELECT,
            replacements: {
                id,
            },
        },
    );

    if (rows.length !== 1) {
        return null;
    }

    return serializeComment(rows[0]);
};
