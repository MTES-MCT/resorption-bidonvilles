import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export default async (location) => {
    const organizationsWithUsersHavingPermissionsOnJustice = await sequelize.query(
        `
        WITH user_options AS (
            SELECT fk_user, ARRAY_AGG(fk_option) AS options FROM user_permission_options GROUP BY fk_user
        )
        SELECT
            uap.user_id,
            u.first_name,
            u.last_name,
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
            o.fk_type AS "type_id",
            ot.fk_category AS "type_category",
            ot.name_singular AS "type_name",
            ot.abbreviation AS "type_abbreviation",
            uap.fk_entity,
            uap.fk_feature,
            uap.allowed,
            uap.allow_all,
            uap.regions as "regions_allowed",
            uap.departements as "departements_allowed",
            uap.epci as "epci_allowed",
            uap.cities as "cities_allowed",
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
            ot.fk_role NOT IN ('national_establisment')
        AND
            -- utilisateurs traqués
            u.fk_status = 'active' 
        AND
            -- et actifs
            u.to_be_tracked = true
            -- Vérification des droits
        AND
        (
            allow_all IS true
            OR
                (
                    ARRAY_LENGTH(uap.regions, 1) > 0
                AND
                    :regionCode = ANY(uap.regions)
                )
            OR
                (
                    ARRAY_LENGTH(uap.departements, 1) > 0
                AND
                    :departementCode = ANY(uap.departements)
                )
            OR
                (
                    ARRAY_LENGTH(uap.epci, 1) > 0
                AND
                    :epciCode = ANY(uap.epci)
                )
            OR
                (
                    ARRAY_LENGTH(uap.cities, 1) > 0
                AND
                    :cityCode = ANY(uap.cities)
                )
            OR
                (
                    (uap.regions IS NULL OR ARRAY_LENGTH(uap.regions, 1) < 1)
                AND
                    (uap.departements IS NULL OR ARRAY_LENGTH(uap.departements, 1) < 1)
                AND
                    (uap.epci IS NULL OR ARRAY_LENGTH(uap.epci, 1) < 1)
                AND
                    (uap.cities IS NULL OR ARRAY_LENGTH(uap.cities, 1) < 1)
                AND
                    :departementCode = o.departement_code
                )
            OR
                (
                    (uap.regions IS NULL OR ARRAY_LENGTH(uap.regions, 1) < 1)
                AND
                    (uap.departements IS NULL OR ARRAY_LENGTH(uap.departements, 1) < 1)
                AND
                    (uap.epci IS NULL OR ARRAY_LENGTH(uap.epci, 1) < 1)
                AND
                    (uap.cities IS NULL OR ARRAY_LENGTH(uap.cities, 1) < 1)
                AND
                    o.departement_code is null
                AND
                    o.region_code IS NULL
                AND
                    o.epci_code IS NULL
                AND
                    o.city_code IS NULL
                )
        )       
        `,
        {
            replacements: {
                regionCode: location.region.code,
                departementCode: location.departement.code,
                epciCode: location.epci.code,
                cityCode: location.city.code,
            },
            type: QueryTypes.SELECT,
        },
    );
    return organizationsWithUsersHavingPermissionsOnJustice;
};
