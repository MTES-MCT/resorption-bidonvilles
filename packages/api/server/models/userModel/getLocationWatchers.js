const sequelize = require('#db/sequelize');
const { mailBlacklist } = require('#server/config');

module.exports = async (location, watcherType = 'shantytown_creation', applyBlacklist = false) => {
    const users = await sequelize.query(
        `WITH email_unsubscriptions AS (
            SELECT fk_user, ARRAY_AGG(email) AS unsubscriptions FROM user_email_unsubscriptions GROUP BY fk_user
        )

        SELECT
            u.user_id,
            u.email,
            u.first_name,
            u.last_name
        FROM localized_organizations lo
        LEFT JOIN users u ON u.fk_organization = lo.organization_id
        LEFT JOIN email_unsubscriptions ON email_unsubscriptions.fk_user = u.user_id
        WHERE
            (
                (lo.location_type = 'departement' AND lo.departement_code = :departementCode)
                OR
                ((lo.location_type = 'epci' OR lo.location_type = 'city') AND lo.epci_code = :epciCode)
            )
            AND u.fk_status = 'active'
            AND lo.active = TRUE
            AND (email_unsubscriptions.unsubscriptions IS NULL OR NOT(:watcherType = ANY(email_unsubscriptions.unsubscriptions)))`,
        {
            type: sequelize.QueryTypes.SELECT,
            replacements: {
                departementCode: location.departement.code,
                epciCode: location.epci.code,
                watcherType,
            },
        },
    );

    if (applyBlacklist === true) {
        return users.filter(({ user_id }) => !mailBlacklist.includes(user_id));
    }

    return users;
};
