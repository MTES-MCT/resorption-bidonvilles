import { sequelize } from '#db/sequelize';
import { City } from '#server/models/geoModel/Location.d';
import { QueryTypes } from 'sequelize';

type LocationWatcher = {
    user_id: string,
    email: string,
    first_name: string,
    last_name: string,
};

export default async (location: City, watcherType = 'shantytown_creation'): Promise<LocationWatcher[]> => sequelize.query(
    `WITH email_unsubscriptions AS (
        SELECT fk_user, ARRAY_AGG(email_subscription) AS unsubscriptions FROM user_email_unsubscriptions GROUP BY fk_user
    ),
    user_intervention_areas AS (
        SELECT
            users.user_id,
            array_remove(array_agg(intervention_areas.fk_departement), NULL) AS departements,
            array_remove(array_agg(COALESCE(intervention_areas.fk_epci, cities.fk_epci)), NULL) AS epci
        FROM users
        LEFT JOIN intervention_areas ON (
            users.user_id = intervention_areas.fk_user
            OR (users.use_custom_intervention_area IS FALSE AND users.fk_organization = intervention_areas.fk_organization)
        )
        LEFT JOIN cities ON intervention_areas.fk_city = cities.code
        WHERE intervention_areas.is_main_area IS TRUE
        GROUP BY users.user_id
    )

    SELECT
        u.user_id,
        u.email,
        u.first_name,
        u.last_name
    FROM users u
    LEFT JOIN user_intervention_areas ON user_intervention_areas.user_id = u.user_id
    LEFT JOIN email_unsubscriptions ON email_unsubscriptions.fk_user = u.user_id
    WHERE
        (:departementCode = ANY(user_intervention_areas.departements)
        OR
        :epciCode = ANY(user_intervention_areas.epci))
        AND u.fk_status = 'active'
        AND (email_unsubscriptions.unsubscriptions IS NULL OR NOT(:watcherType = ANY(email_unsubscriptions.unsubscriptions)))`,
    {
        type: QueryTypes.SELECT,
        replacements: {
            departementCode: location.departement.code,
            epciCode: location.epci.code,
            watcherType,
        },
    },
);
