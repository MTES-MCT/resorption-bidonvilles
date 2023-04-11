import { sequelize } from '#db/sequelize';


export default async (): Promise<Array<Object>> => {
    const response = await sequelize.query(
        `  
            WITH navigation_logs as (
                (
                    SELECT 
                        CAST(user_navigation_log_id AS varchar(255))  as id,
                        fk_user as user_id,
                        datetime as date,
                        page as action
                    FROM user_mobile_navigation_logs
                )
                    UNION
                (
                    SELECT 
                        note_id as id,
                        created_by as user_id,
                        created_at as date,
                        'creationNote' as action 
                    FROM notes
                )
                    UNION
                (
                    SELECT 
                        notes.note_id as id,
                        notes.created_by as user_id,
                        notes_publications.created_at as date,
                        'publicationNote' as action
                    FROM notes_publications
                    LEFT JOIN notes ON notes.note_id = notes_publications.fk_note
                )
            )
            SELECT 
                navigation_logs.id,
                navigation_logs.user_id,
                navigation_logs.date,
                navigation_logs.action,
                users.fk_role_regular AS role,
                lo.location_type,
                lo.region_code,
                lo.region_name,
                lo.departement_code,
                lo.departement_name,
                ot.name_singular AS organization_type,
                oc.name_singular AS organization_category
            FROM navigation_logs
            LEFT JOIN users ON users.user_id = navigation_logs.user_id
            LEFT JOIN localized_organizations lo ON lo.organization_id = users.fk_organization
            LEFT JOIN organization_types ot ON ot.organization_type_id = lo.fk_type
            LEFT JOIN organization_categories oc ON oc.uid = ot.fk_category
            ORDER BY navigation_logs.user_id ASC, navigation_logs.date ASC
    `,
    );

    return response[0];
};
