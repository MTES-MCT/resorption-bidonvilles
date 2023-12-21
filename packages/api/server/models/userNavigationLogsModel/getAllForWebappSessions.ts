import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export type WebappSessionRow = {
    log_id: number,
    user_id: number,
    date: Date,
    page: string,
    role: string,
    is_national: boolean,
    regions: string[],
    departements: string[],
    epci: string[],
    cities: string[],
    organization_type: string,
    organization_category: string
};

export default (): Promise<WebappSessionRow[]> => sequelize.query(
    `WITH user_areas AS (
        SELECT
            users.user_id,
            COUNT(CASE intervention_areas.type WHEN 'nation' THEN 1 ELSE NULL END) > 0 AS is_national,
            array_remove(array_agg(intervention_areas.fk_region), null) AS regions,
            array_remove(array_agg(intervention_areas.fk_departement), null) AS departements,
            array_remove(array_agg(intervention_areas.fk_epci), null) AS epci,
            array_remove(array_agg(intervention_areas.fk_city), null) AS cities
        FROM users
        LEFT JOIN intervention_areas ON intervention_areas.fk_user = users.user_id OR (users.use_custom_intervention_area IS FALSE AND intervention_areas.fk_organization = users.fk_organization)
        WHERE intervention_areas.is_main_area IS TRUE
        GROUP BY users.user_id
    )

    SELECT 
        navigation_logs.user_navigation_log_id AS log_id,
        navigation_logs.fk_user AS user_id,
        navigation_logs.datetime as date,
        navigation_logs.page,
        users.fk_role_regular AS role,
        user_areas.is_national,
        user_areas.regions,
        user_areas.departements,
        user_areas.epci,
        user_areas.cities,
        ot.name_singular AS organization_type,
        oc.name_singular AS organization_category
    FROM user_webapp_navigation_logs navigation_logs
    LEFT JOIN users ON users.user_id = navigation_logs.fk_user
    LEFT JOIN user_areas ON user_areas.user_id = navigation_logs.fk_user
    LEFT JOIN organization_types ot ON ot.organization_type_id = lo.fk_type
    LEFT JOIN organization_categories oc ON oc.uid = ot.fk_category
    ORDER BY navigation_logs.fk_user ASC, navigation_logs.datetime ASC`,
    {
        type: QueryTypes.SELECT,
    },
);
