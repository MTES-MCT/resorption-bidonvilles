import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export default async () => {
    const organizationsWithUsersHavingPermissionsOnJustice = await sequelize.query(
        `
        WITH user_options AS (
            SELECT fk_user, ARRAY_AGG(fk_option) AS options FROM user_permission_options GROUP BY fk_user
        )
        SELECT
            uap.level,
            uap.user_id,
            u.first_name,
            u.last_name,
            U.fk_status,
            u.to_be_tracked,
            u.fk_role,
            u.fk_role_regular,
            uap.organization_id as id,
            o.name,
            o.abbreviation,
            o.location_type,
            o.region_code,
            o.region_name,
            o.departement_code,
            o.departement_name,
            o.epci_code,
            o.epci_name,
            o.city_code,
            o.city_name,
            o.city_main,
            o.being_funded,
            o.being_funded_at,
            ot.fk_role,
            o.fk_type AS "type_id",
            ot.fk_category AS "type_category",
            ot.name_singular AS "type_name",
            ot.abbreviation AS "type_abbreviation",
            uap.fk_entity,
            uap.fk_feature,
            uap.allowed,
            COALESCE(uo.options, array[]::varchar[]) AS permission_options
        FROM
            user_actual_permissions uap
            LEFT JOIN users u ON uap.user_id = u.user_id
            LEFT JOIN localized_organizations o ON uap.organization_id = o.organization_id
            LEFT JOIN organization_types ot ON o.fk_type = ot.organization_type_id
            LEFT JOIN user_options uo ON uo.fk_user = uap.user_id
        WHERE
                uap.fk_entity = 'shantytown_justice'
        AND
                uap.fk_feature = 'access'
        AND
                uap.allowed IS true 
        AND
            ot.uid NOT IN (
                SELECT
                DISTINCT uid
                FROM
                organization_types ot
                WHERE
                ot.fk_category = 'public_establishment'
            )
        AND
            -- On supprime les utilisateurs de structures de type 'national_establisment'
            -- Mais on laisse les utilisateurs qui ont un fk_role_regular de type 'national_establisment'
            ot.fk_role NOT IN ('national_establisment') ;
        `,
        {
            type: QueryTypes.SELECT,
        },
    );
    return organizationsWithUsersHavingPermissionsOnJustice;
};
