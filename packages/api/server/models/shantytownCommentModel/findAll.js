const { sequelize } = require('#db/models');
const { serializeComment } = require('#server/models/shantytownModel')(sequelize);

/**
 * @param {Location} [location] Location filter. If set to null, no filter is applied and all
 *                              comments are returned
 * @param {Location} [privateLocation] Location filter for private comments. If set to null, no
 *                                     private comments are returned. It is assumed this location is
 *                                     a subset of "location" (for instance, you are not expected to
 *                                     give a departement as location, and a region as privateLocation)
 */
module.exports = async (location = null, privateLocation = null) => {
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
        ${additionalWhere.length > 0
        ? `LEFT JOIN
                shantytowns s ON sc.fk_shantytown = s.shantytown_id
            LEFT JOIN
                cities c ON s.fk_city = c.code
            LEFT JOIN
                departements d ON c.fk_departement = d.code
            WHERE ${additionalWhere.join(' AND ')}`
        : ''
}`,
        {
            type: sequelize.QueryTypes.SELECT,
            replacements,
        },
    );

    return rows.map(serializeComment);
};
