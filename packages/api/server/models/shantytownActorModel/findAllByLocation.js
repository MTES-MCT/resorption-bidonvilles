const { sequelize } = require('#db/models');

module.exports = (location = null) => {
    let where = '';
    const replacements = {};
    if (location !== null) {
        if (location.type === 'region') {
            where = 'd.fk_region = :locationCode';
            replacements.locationCode = location.code;
        } else if (location.type === 'departement') {
            where = 'd.code = :locationCode';
            replacements.locationCode = location.code;
        } else {
            where = 'FALSE';
        }
    }

    return sequelize.query(
        `SELECT
            sa.fk_shantytown AS "shantytownId",
            sa.themes,
            sa.autre,
            sa.created_at,
            u.user_id AS "userId",
            u.email AS "userEmail",
            u.first_name AS "userFirstName",
            u.last_name AS "userLastName",
            u.fk_role_regular AS "userRole",
            o.organization_id AS "organizationId",
            o.name AS "organizationName",
            o.abbreviation AS "organizationAbbreviation",
            s.resorption_target AS "shantytownResorptionTarget",
            d.name AS "departementName"
        FROM shantytown_actors sa
        LEFT JOIN users u ON sa.fk_user = u.user_id
        LEFT JOIN organizations o ON u.fk_organization = o.organization_id
        LEFT JOIN shantytowns s ON sa.fk_shantytown = s.shantytown_id
        LEFT JOIN cities c ON s.fk_city = c.code
        LEFT JOIN departements d ON c.fk_departement = d.code
        WHERE u.fk_status = 'active'${where !== '' ? `AND ${where}` : ''}
        ORDER BY sa.created_at DESC`,
        {
            type: sequelize.QueryTypes.SELECT,
            replacements,
        },
    );
};
