const sequelize = require('#db/sequelize');

module.exports = async (shantytownId, commentId, isPrivate) => {
    if (isPrivate) {
        return sequelize.query(`
        WITH constants(departement) AS (
            SELECT cities.fk_departement AS departement
            FROM shantytowns
            LEFT JOIN cities ON shantytowns.fk_city = cities.code
            WHERE shantytowns.shantytown_id = :shantytownId
        ),
        email_subscriptions AS (
            SELECT fk_user, ARRAY_AGG(email_subscription) AS subscriptions FROM user_email_subscriptions GROUP BY fk_user
        )
        
        SELECT
            u.email,
            u.first_name,
            u.last_name
        FROM (
            (SELECT scut.fk_user 
            FROM shantytown_comment_user_targets scut
            WHERE scut.fk_comment = :commentId)

            UNION

            (SELECT u.user_id AS fk_user
            FROM users u
            LEFT JOIN localized_organizations lo ON u.fk_organization = lo.organization_id
            LEFT JOIN shantytown_comment_organization_targets scot ON scot.fk_organization = lo.organization_id
            WHERE scot.fk_comment = :commentId
            )

            UNION

            (SELECT u.user_id AS fk_user
            FROM users u
            LEFT JOIN constants ON TRUE
            LEFT JOIN localized_organizations lo ON u.fk_organization = lo.organization_id
            LEFT JOIN user_actual_permissions up ON u.user_id = up.user_id
            WHERE up.fk_feature = 'listPrivate' AND up.fk_entity = 'shantytown_comment' AND up.allowed IS TRUE
            AND lo.departement_code = constants.departement
            )
        ) t
        LEFT JOIN users u ON t.fk_user = u.user_id
        LEFT JOIN email_subscriptions ON email_subscriptions.fk_user = u.user_id
        LEFT JOIN localized_organizations lo ON u.fk_organization = lo.organization_id
        WHERE u.fk_status = 'active'
        AND lo.active IS TRUE AND ('comment_notification' = ANY(email_subscriptions.subscriptions))`, {
            type: sequelize.QueryTypes.SELECT,
            replacements: {
                shantytownId,
                commentId,
            },
        });
    }
    return sequelize.query(
        `WITH constants(departement) AS (
        SELECT cities.fk_departement AS departement
        FROM shantytowns
        LEFT JOIN cities ON shantytowns.fk_city = cities.code
        WHERE shantytowns.shantytown_id = :shantytownId
    ),
    email_subscriptions AS (
        SELECT fk_user, ARRAY_AGG(email_subscription) AS subscriptions FROM user_email_subscriptions GROUP BY fk_user
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
        LEFT JOIN localized_organizations lo ON u.fk_organization = lo.organization_id
        WHERE lo.departement_code = constants.departement
            AND lo.active IS TRUE)

    ) t
    LEFT JOIN users u ON t.fk_user = u.user_id
    LEFT JOIN email_subscriptions ON email_subscriptions.fk_user = u.user_id
    WHERE u.fk_status = 'active' AND ('comment_notification' = ANY(email_subscriptions.subscriptions))
    `,
        {
            type: sequelize.QueryTypes.SELECT,
            replacements: {
                shantytownId,
                commentId,
            },
        },
    );
};
