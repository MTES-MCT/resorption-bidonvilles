const sequelize = require('#db/sequelize');

module.exports = async (planId, commentId) => sequelize.query(
    `WITH constants(departement) AS (
        SELECT fk_departement as departement
        FROM plan_departements
        WHERE fk_plan = :planId
    ),
    email_unsubscriptions AS (
        SELECT fk_user, ARRAY_AGG(email_subscription) AS unsubscriptions FROM user_email_unsubscriptions GROUP BY fk_user
    )

    SELECT
        u.email,
        u.first_name,
        u.last_name
    FROM users u
    LEFT JOIN constants ON TRUE
    LEFT JOIN localized_organizations lo ON u.fk_organization = lo.organization_id
    LEFT JOIN email_unsubscriptions ON email_unsubscriptions.fk_user = u.user_id
    LEFT JOIN plan_operators po ON po.fk_user = u.user_id AND po.fk_plan = :planId
    WHERE u.fk_status = 'active'
        AND (lo.departement_code = constants.departement
            AND lo.active IS TRUE)
        AND (email_unsubscriptions.unsubscriptions IS NULL OR NOT('plan_comment_notification' = ANY(email_unsubscriptions.unsubscriptions)))
        AND (u.fk_role_regular = 'direct_collaborator' OR po.fk_plan IS NOT null)
    `,
    {
        type: sequelize.QueryTypes.SELECT,
        replacements: {
            planId,
            commentId,
        },
    },
);
