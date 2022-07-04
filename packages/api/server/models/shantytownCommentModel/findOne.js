const sequelize = require('#db/sequelize');
const { serializeComment } = require('#server/models/shantytownModel');

/**
 * @param {Number} id A shantytown_comment_id
 */
module.exports = async (id) => {
    const rows = await sequelize.query(
        `WITH organization_comment_access AS (
            SELECT 
                 scot.fk_comment AS shantytown_comment_id,
                 ARRAY_AGG(lo.name) AS organization_target_name,
                 ARRAY_AGG(lo.organization_id) AS organization_target_id
             FROM shantytown_comment_organization_targets scot 
             LEFT JOIN localized_organizations lo ON lo.organization_id = scot.fk_organization
             GROUP BY scot.fk_comment
         ),
         user_comment_access AS (
             SELECT 
                 scut.fk_comment AS shantytown_comment_id,
                 ARRAY_AGG(CONCAT(users.first_name, ' ', users.last_name)) AS user_target_name,
                 ARRAY_AGG(users.user_id) AS user_target_id
             FROM shantytown_comment_user_targets scut 
             LEFT JOIN users ON users.user_id = scut.fk_user
             GROUP BY scut.fk_comment
         )
        SELECT
            sc.shantytown_comment_id AS "commentId",
            sc.description AS "commentDescription",
            sc.fk_shantytown AS "shantytownId",
            sc.created_at AS "commentCreatedAt",
            sc.created_by "commentCreatedBy",
            u.first_name AS "userFirstName",
            u.last_name AS "userLastName",
            u.position AS "userPosition",
            o.abbreviation AS "organizationAbbreviation",
            o.name AS "organizationName",
            o.organization_id AS "organizationId",
            oca.organization_target_name,
            uca.user_target_name
        FROM
            shantytown_comments sc
        LEFT JOIN
            users u ON sc.created_by = u.user_id
        LEFT JOIN
            organizations o ON u.fk_organization = o.organization_id
        LEFT JOIN 
            organization_comment_access oca ON sc.shantytown_comment_id = oca.shantytown_comment_id
        LEFT JOIN 
            user_comment_access uca ON sc.shantytown_comment_id = uca.shantytown_comment_id
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
