const sequelize = require('#db/sequelize');

/**
 * @param {Location} [location] Location filter. If set to null, no filter is applied and all
 *                              comments are returned
 * @param {Location} [privateLocation] Location filter for private comments. If set to null, no
 *                                     private comments are returned. It is assumed this location is
 *                                     a subset of "location" (for instance, you are not expected to
 *                                     give a departement as location, and a region as privateLocation)
 */
module.exports = (location = null, privateLocation = null) => {
    const additionalWhere = [];
    const replacements = {};
    if (location && location.type && location.code) {
        replacements.publicLocationCode = location.code;

        if (location.type === 'region') {
            additionalWhere.push('d.fk_region = :publicLocationCode');
        } else if (location.type === 'departement') {
            additionalWhere.push('d.code = :publicLocationCode');
        }
    }

    if (privateLocation && privateLocation.type && privateLocation.code) {
        replacements.privateLocationCode = privateLocation.code;

        // private comments are a subset of public comments, hence the ("sc.private IS FALSE OR ...")
        if (privateLocation.type === 'region') {
            additionalWhere.push('(sc.private IS FALSE OR d.fk_region = :privateLocationCode)');
        } else if (privateLocation.type === 'departement') {
            additionalWhere.push('(sc.private IS FALSE OR d.code = :privateLocationCode)');
        } else if (privateLocation.type !== 'nation') {
            additionalWhere.push('sc.private IS FALSE');
        }
    } else {
        additionalWhere.push('sc.private IS FALSE');
    }

    return sequelize.query(
        `WITH organization_comment_access AS (
            SELECT 
                 scoa.fk_comment AS shantytown_comment_id,
                 ARRAY_AGG(lo.name) AS organization_target_name,
                 ARRAY_AGG(lo.organization_id) AS organization_target_id
             FROM shantytown_comment_organization_access scoa 
             LEFT JOIN localized_organizations lo ON lo.organization_id = scoa.fk_organization
             GROUP BY scoa.fk_comment
         ),
         user_comment_access AS (
             SELECT 
                 scua.fk_comment AS shantytown_comment_id,
                 ARRAY_AGG(CONCAT(users.first_name, ' ', users.last_name)) AS user_target_name,
                 ARRAY_AGG(users.user_id) AS user_target_id
             FROM shantytown_comment_user_access scua 
             LEFT JOIN users ON users.user_id = scua.fk_user
             GROUP BY scua.fk_comment
         )
        SELECT
            sc.shantytown_comment_id AS "commentId",
            sc.description AS "commentDescription",
            sc.fk_shantytown AS "shantytownId",
            sc.created_at AS "commentCreatedAt",
            sc.created_by "commentCreatedBy",
            sc.private AS "commentPrivate",
            u.user_id AS "userId",
            u.first_name AS "userFirstName",
            u.last_name AS "userLastName",
            u.position AS "userPosition",
            rr.name AS "userRole",
            o.abbreviation AS "organizationAbbreviation",
            o.name AS "organizationName",
            o.organization_id AS "organizationId",
            d.name AS "departementName",
            s.resorption_target AS "shantytownResorptionTarget",
            oca.organization_target_name,
            uca.user_target_name
        FROM
            shantytown_comments sc
        LEFT JOIN
            users u ON sc.created_by = u.user_id
        LEFT JOIN
            roles_regular rr ON u.fk_role_regular = rr.role_id
        LEFT JOIN
            organizations o ON u.fk_organization = o.organization_id
        LEFT JOIN
            shantytowns s ON sc.fk_shantytown = s.shantytown_id
        LEFT JOIN
            cities c ON s.fk_city = c.code
        LEFT JOIN
            departements d ON c.fk_departement = d.code
        LEFT JOIN 
            organization_comment_access oca ON sc.shantytown_comment_id = oca.shantytown_comment_id
        LEFT JOIN 
            user_comment_access uca ON sc.shantytown_comment_id = uca.shantytown_comment_id
        ${additionalWhere.length > 0
        ? `WHERE ${additionalWhere.join(' AND ')}`
        : ''
}
        ORDER BY sc.created_at DESC`,
        {
            type: sequelize.QueryTypes.SELECT,
            replacements,
        },
    );
};
