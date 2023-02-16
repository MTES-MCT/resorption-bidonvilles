import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export default async (actionId, commentId) => sequelize.query(
    `WITH operator_organization AS (
        SELECT users.fk_organization AS organization_id, ao.fk_action
        FROM action_operators ao
        LEFT JOIN users ON ao.fk_user = users.user_id
    ),
    email_unsubscriptions AS (
        SELECT fk_user, ARRAY_AGG(email_subscription) AS unsubscriptions FROM user_email_unsubscriptions GROUP BY fk_user
    )

    SELECT
        u.email,
        u.first_name,
        u.last_name
    FROM users u
    LEFT JOIN localized_organizations lo ON u.fk_organization = lo.organization_id
    LEFT JOIN operator_organization op ON op.organization_id = lo.organization_id AND op.fk_action = :actionId
    LEFT JOIN email_unsubscriptions ON email_unsubscriptions.fk_user = u.user_id
    WHERE u.fk_status = 'active'
        AND (lo.departement_code = (SELECT fk_departement FROM actions WHERE action_id = :actionId)
            AND lo.active IS TRUE)
        AND (email_unsubscriptions.unsubscriptions IS NULL OR NOT('plan_comment_notification' = ANY(email_unsubscriptions.unsubscriptions)))
        AND (u.fk_role_regular = 'direct_collaborator' OR op.fk_action IS NOT null)
    `,
    {
        type: QueryTypes.SELECT,
        replacements: {
            actionId,
            commentId,
        },
    },
);
