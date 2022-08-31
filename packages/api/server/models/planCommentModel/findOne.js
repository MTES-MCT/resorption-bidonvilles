const sequelize = require('#db/sequelize');
const { serializeComment } = require('#server/models/planModel');

/**
 * @param {Number} id A plan_comment_id
 */
module.exports = async (id) => {
    const rows = await sequelize.query(
        `
        SELECT
            pc.plan_comment_id AS "commentId",
            pc.description AS "commentDescription",
            pc.fk_plan AS "planId",
            pc.created_at AS "commentCreatedAt",
            pc.created_by "commentCreatedBy",
            u.user_id AS "userId",
            u.first_name AS "userFirstName",
            u.last_name AS "userLastName",
            u.position AS "userPosition",
            o.organization_id AS "organizationId",
            o.name AS "organizationName",
            o.abbreviation AS "organizationAbbreviation"
        FROM
            plan_comments pc
        LEFT JOIN
            users u ON pc.created_by = u.user_id
        LEFT JOIN
            organizations o ON u.fk_organization = o.organization_id
        WHERE
            pc.plan_comment_id = :id`,
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
