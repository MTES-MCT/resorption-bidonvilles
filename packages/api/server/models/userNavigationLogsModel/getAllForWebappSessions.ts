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
    `
    SELECT 
        navigation_logs.user_navigation_log_id AS log_id,
        navigation_logs.fk_user AS user_id,
        navigation_logs.datetime as date,
        navigation_logs.page,
        users.fk_role_regular AS role,
        v_user_areas.is_national,
        v_user_areas.regions,
        v_user_areas.departements,
        v_user_areas.epci,
        v_user_areas.cities,
        ot.name_singular AS organization_type,
        oc.name_singular AS organization_category
    FROM user_webapp_navigation_logs navigation_logs
    LEFT JOIN users ON users.user_id = navigation_logs.fk_user
    LEFT JOIN v_user_areas ON v_user_areas.user_id = navigation_logs.fk_user
    LEFT JOIN organization_types ot ON ot.organization_type_id = lo.fk_type
    LEFT JOIN organization_categories oc ON oc.uid = ot.fk_category
    ORDER BY navigation_logs.fk_user ASC, navigation_logs.datetime ASC`,
    {
        type: QueryTypes.SELECT,
    },
);
