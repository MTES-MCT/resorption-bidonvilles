import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export default (where = []) => {
    const replacements = {};
    const whereClause = where.map((clauses, index) => {
        const clauseGroup = Object.keys(clauses).map((column) => {
            replacements[`${column}${index}`] = clauses[column].value ?? clauses[column];
            return `${clauses[column].query ?? `users.${column}`} ${clauses[column].operator ?? 'IN'} (:${column}${index})`;
        }).join(' OR ');

        return `(${clauseGroup})`;
    }).join(' AND ');

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
            departements.name AS "departementName"
        FROM shantytown_actors sa
        LEFT JOIN users u ON sa.fk_user = u.user_id
        LEFT JOIN organizations o ON u.fk_organization = o.organization_id
        LEFT JOIN shantytowns s ON sa.fk_shantytown = s.shantytown_id
        LEFT JOIN cities ON s.fk_city = cities.code
        LEFT JOIN epci ON cities.fk_epci = epci.code
        LEFT JOIN departements ON cities.fk_departement = departements.code
        LEFT JOIN regions ON departements.fk_region = regions.code
        WHERE u.fk_status = 'active'${whereClause !== '' ? `AND ${whereClause}` : ''}
        ORDER BY sa.created_at DESC`,
        {
            type: QueryTypes.SELECT,
            replacements,
        },
    );
};
