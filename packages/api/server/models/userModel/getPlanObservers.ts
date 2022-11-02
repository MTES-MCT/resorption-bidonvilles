import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export default async (planId, commentId) => sequelize.query(
    `WITH constants(departement) AS (
        SELECT fk_departement as departement
        FROM plan_departements
        WHERE fk_plan = :planId
    ),
    operator_organization AS (
        SELECT lo.organization_id, po.fk_plan
        FROM plan_operators po
        LEFT JOIN users u  ON po.fk_user = u.user_id
        LEFT JOIN localized_organizations lo ON lo.organization_id = u.fk_organization
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
    LEFT JOIN operator_organization op ON op.organization_id = lo.organization_id AND op.fk_plan = :planId
    LEFT JOIN email_unsubscriptions ON email_unsubscriptions.fk_user = u.user_id
    WHERE u.fk_status = 'active'
        AND (lo.departement_code = constants.departement
            AND lo.active IS TRUE)
        AND (email_unsubscriptions.unsubscriptions IS NULL OR NOT('plan_comment_notification' = ANY(email_unsubscriptions.unsubscriptions)))
        AND (u.fk_role_regular = 'direct_collaborator' OR op.fk_plan IS NOT null)
    `,
    {
        type: QueryTypes.SELECT,
        replacements: {
            planId,
            commentId,
        },
    },
);
