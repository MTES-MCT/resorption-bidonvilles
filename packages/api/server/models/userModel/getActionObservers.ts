import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

type ActionObserver = {
    email: string;
    first_name: string;
    last_name: string;
};

export default async (actionId: number): Promise<ActionObserver[]> => sequelize.query(
    `WITH constants(region) AS
    (
        SELECT departements.fk_region AS region
        FROM actions
        LEFT JOIN departements ON actions.fk_departement = departements.code
        WHERE actions.action_id = :actionId
    ),
    email_unsubscriptions AS (
        SELECT fk_user, ARRAY_AGG(email_subscription) AS unsubscriptions FROM user_email_unsubscriptions GROUP BY fk_user
    )

    SELECT
        u.email,
        u.first_name,
        u.last_name
    FROM users
    LEFT JOIN constants ON TRUE
    LEFT JOIN v_user_areas ON v_user_areas.user_id = users.user_id AND v_user_areas.is_main_area IS TRUE
    LEFT JOIN action_operators ON action_operators.fk_organization = users.fk_organization AND action_operators.fk_action = :actionId
    LEFT JOIN action_managers ON action_managers.fk_organization = users.fk_organization AND action_managers.fk_action = :actionId
    LEFT JOIN email_unsubscriptions ON email_unsubscriptions.fk_user = u.user_id

    WHERE 
        users.fk_status = 'active'
        AND (
            -- soit l'utilisateur est un opérateur/pilote de l'action
            (action_operators.fk_user IS NOT NULL OR action_managers.fk_user IS NOT NULL)
            OR
            -- soit l'utilisateur est un correspondant du département concerné, et abonné aux notifications
            (
                (email_unsubscriptions.unsubscriptions IS NULL OR NOT('action_comment_notification' = ANY(email_unsubscriptions.unsubscriptions)))
                AND
                users.fk_role_regular = 'direct_collaborator'
                AND
                (
                    -- soit l'utilisateur est un correspondant national
                    v_user_areas.is_national IS TRUE
                    OR
                    -- soit l'utilisateur est un correspondant du département concerné
                    constants.region = ANY(v_user_areas.regions)
                )
            )
        )
    `,
    {
        type: QueryTypes.SELECT,
        replacements: {
            actionId,
        },
    },
);
