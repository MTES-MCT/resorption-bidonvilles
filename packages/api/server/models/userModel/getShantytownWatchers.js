const { sequelize } = require('#db/models');

module.exports = async (shantytownId, canListPrivateComments) => sequelize.query(
    `WITH constants(departement, epci) AS (
        SELECT cities.fk_departement AS departement, cities.fk_epci AS epci
        FROM shantytowns
        LEFT JOIN cities ON shantytowns.fk_city = cities.code
        WHERE shantytowns.shantytown_id = :shantytownId
    )

    SELECT
        u.email,
        u.first_name,
        u.last_name
    FROM (
        (SELECT sw.fk_user
        FROM shantytown_watchers sw
        WHERE sw.fk_shantytown = :shantytownId)

        UNION

        (SELECT u.user_id AS fk_user
        FROM users u
        LEFT JOIN constants ON TRUE
        LEFT JOIN organizations o ON u.fk_organization = o.organization_id
        WHERE o.fk_departement = constants.departement
            AND o.active IS TRUE)

        UNION

        (SELECT u.user_id AS fk_user
        FROM users u
        LEFT JOIN constants ON TRUE
        LEFT JOIN localized_organizations lo ON u.fk_organization = lo.organization_id
        WHERE lo.epci_code = constants.epci
            AND lo.active IS TRUE)
    ) t
    LEFT JOIN users u ON t.fk_user = u.user_id
    LEFT JOIN user_actual_permissions up ON t.fk_user = up.user_id AND up.fk_feature = 'listPrivate' AND up.fk_entity = 'shantytown_comment' AND up.allowed IS TRUE
    WHERE u.fk_status = 'active'
    ${canListPrivateComments === true ? 'AND up.allowed IS TRUE' : ''}
    `,
    {
        type: sequelize.QueryTypes.SELECT,
        replacements: {
            shantytownId,
        },
    },
);
