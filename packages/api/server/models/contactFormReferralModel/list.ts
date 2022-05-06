import { sequelize } from '#db/sequelize';

export default (where = []) => {
    const replacements = {};

    const whereClause = where.map((clauses, index) => {
        const clauseGroup = Object.keys(clauses).map((column) => {
            replacements[`${column}${index}`] = clauses[column].value || clauses[column];
            return `${clauses[column].query || `users.${column}`} ${clauses[column].operator || 'IN'} (:${column}${index})`;
        }).join(' OR ');

        return `(${clauseGroup})`;
    }).join(' AND ');

    return sequelize.query(
        `SELECT 
                INITCAP(users.first_name) AS first_name,
                UPPER(users.last_name) AS last_name,
                users.email,
                departement_code,
                localized_organizations.name AS organization_name,
                cfr.reason,
                cfr.reason_other,
                cfr.reason_word_of_mouth
            FROM
                contact_form_referrals AS cfr
            LEFT JOIN users ON fk_user = user_id
            LEFT JOIN localized_organizations ON fk_organization = organization_id
            LEFT JOIN regions ON localized_organizations.region_code = regions.code
            LEFT JOIN departements ON localized_organizations.departement_code = departements.code
            LEFT JOIN epci ON localized_organizations.epci_code = epci.code
            LEFT JOIN cities ON localized_organizations.city_code = cities.code
            ${whereClause ? `WHERE ${whereClause}` : ''}`,
        {
            type: sequelize.QueryTypes.SELECT,
            replacements,
        },
    );
};
