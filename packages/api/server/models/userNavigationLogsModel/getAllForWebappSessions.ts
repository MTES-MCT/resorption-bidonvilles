import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

type WebappSessionRow = {
    log_id: number,
    user_id: number,
    date: Date,
    page: string,
    role: string,
    location_type: string,
    region_code: string | null,
    region_name: string | null,
    departement_code: string | null,
    departement_name: string | null,
    organization_type: string,
    organization_category: string
};

export default (): Promise<WebappSessionRow[]> => sequelize.query(
    `SELECT 
            navigation_logs.user_navigation_log_id AS log_id,
            navigation_logs.fk_user AS user_id,
            navigation_logs.datetime as date,
            navigation_logs.page,
            users.fk_role_regular AS role,
            lo.location_type,
            lo.region_code,
            lo.region_name,
            lo.departement_code,
            lo.departement_name,
            ot.name_singular AS organization_type,
            oc.name_singular AS organization_category
        FROM user_webapp_navigation_logs navigation_logs
        LEFT JOIN users ON users.user_id = navigation_logs.fk_user
        LEFT JOIN localized_organizations lo ON lo.organization_id = users.fk_organization
        LEFT JOIN organization_types ot ON ot.organization_type_id = lo.fk_type
        LEFT JOIN organization_categories oc ON oc.uid = ot.fk_category
        ORDER BY navigation_logs.fk_user ASC, navigation_logs.datetime ASC`,
    {
        type: QueryTypes.SELECT,
    },
);
