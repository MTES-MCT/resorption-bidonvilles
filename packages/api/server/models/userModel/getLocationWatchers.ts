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
    )

    SELECT
        u.user_id,
        u.email,
        u.first_name,
        u.last_name
    FROM users u
    LEFT JOIN v_user_areas ON v_user_areas.user_id = u.user_id AND v_user_areas.is_main_area IS TRUE
    LEFT JOIN email_unsubscriptions ON email_unsubscriptions.fk_user = u.user_id
    WHERE
        :departementCode = ANY(v_user_areas.departements)
        AND u.fk_status = 'active'
        AND (email_unsubscriptions.unsubscriptions IS NULL OR NOT(:watcherType = ANY(email_unsubscriptions.unsubscriptions)))`,
    {
        type: QueryTypes.SELECT,
        replacements: {
            departementCode: location.departement.code,
            watcherType,
        },
    },
);
