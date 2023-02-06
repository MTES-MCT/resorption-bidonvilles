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


    const hash = {};
    organizationsWithUsersHavingPermissionsOnJustice.forEach((user: any) => {
        if (!Object.prototype.hasOwnProperty.call(hash, user.organization_id)) {
            hash[user.organization_id] = {
                id: user.organization_id,
                name: user.name,
                abbreviation: user.abbreviation,
                being_funded: user.being_funded,
                being_funded_at: user.being_funded_at,
                location: {
                    type: user.location_type,
                    region: user.region_code !== null ? {
                        code: user.region_code,
                        name: user.region_name,
                    } : null,
                    departement: user.departement_code !== null ? {
                        code: user.departement_code,
                        name: user.departement_name,
                    } : null,
                    epci: user.epci_code !== null ? {
                        code: user.epci_code,
                        name: user.epci_name,
                    } : null,
                    city: user.city_code !== null ? {
                        code: user.city_code,
                        name: user.city_name,
                        main: user.city_main,
                    } : null,
                },
                type: {
                    id: user.type_id,
                    category: user.type_category,
                    name: user.type_name,
                    abbreviation: user.type_abbreviation,
                },
                users: [],
            };
        }

        if (user.user_id !== null) {
            hash[user.organization_id].users.push({
                id: user.user_id,
                is_admin: user.user_role_admin !== null,
                role: user.user_role_admin || user.user_role_regular,
                first_name: user.user_firstName,
                last_name: user.user_lastName,
                email: user.user_email,
                phone: user.user_phone,
                position: user.user_position,
            });
        }
    });
    return organizationsWithUsersHavingPermissionsOnJustice;
};
