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
    ),
    user_regions AS (
        SELECT
            users.user_id,
            COUNT(CASE intervention_areas.type WHEN 'nation' THEN 1 ELSE NULL END) > 0 AS is_national,
            array_remove(array_agg(
                COALESCE(
                    intervention_areas.fk_region,
                    d1.fk_region,
                    d2.fk_region,
                    d3.fk_region
                )
            ), null) AS regions
        FROM users
        LEFT JOIN intervention_areas ON intervention_areas.fk_user = users.user_id OR (users.use_custom_intervention_area IS FALSE AND intervention_areas.fk_organization = users.fk_organization)
        
        -- on doit récupérer le code de la région, ce qui se fait différement selon le niveau de l'area
        -- cas d'une ville
        LEFT JOIN cities ON intervention_areas.fk_city = cities.code
        LEFT JOIN departements d1 ON intervention_areas.fk_departement = d1.code
        -- cas d'un epci
        LEFT JOIN epci_to_departement ON intervention_areas.fk_epci = epci_to_departement.fk_epci
        LEFT JOIN departements d2 ON epci_to_departement.fk_departement = d2.code
        -- cas d'un département
        LEFT JOIN departements d3 ON intervention_areas.fk_departement = d3.code

        WHERE intervention_areas.is_main_area IS TRUE
        GROUP BY users.user_id
    )

    SELECT
        u.email,
        u.first_name,
        u.last_name
    FROM users
    LEFT JOIN constants ON TRUE
    LEFT JOIN user_regions ON users.user_id = user_regions.user_id
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
                    user_regions.is_national IS TRUE
                    OR
                    -- soit l'utilisateur est un correspondant du département concerné
                    constants.region = ANY(user_regions.regions)
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
