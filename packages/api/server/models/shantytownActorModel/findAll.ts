import { sequelize } from '#db/sequelize';

export default (shantytownIds, transaction = undefined) => {
    const ids = Array.isArray(shantytownIds) ? shantytownIds : [shantytownIds];

    return sequelize.query(
        `SELECT
            sa.fk_shantytown AS "shantytownId",
            sa.themes,
            sa.autre,
            u.user_id AS "userId",
            u.first_name AS "userFirstName",
            u.last_name AS "userLastName",
            o.organization_id AS "organizationId",
            o.name AS "organizationName",
            o.abbreviation AS "organizationAbbreviation"
        FROM
            shantytown_actors sa
        LEFT JOIN users u ON sa.fk_user = u.user_id
        LEFT JOIN organizations o ON u.fk_organization = o.organization_id
        WHERE sa.fk_shantytown IN (:ids) AND u.fk_status = 'active'
        ORDER BY sa.fk_shantytown ASC, u.first_name ASC`,
        {
            type: sequelize.QueryTypes.SELECT,
            replacements: {
                ids,
            },
            transaction,
        },
    );
};
