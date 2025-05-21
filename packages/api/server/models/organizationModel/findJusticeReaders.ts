import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import { Location } from '#server/models/geoModel/Location.d';
import hashAreas from '#server/models/interventionAreaModel/hash';
import { Organization } from '#root/types/resources/Organization.d';
import interventionAreaModel from '../interventionAreaModel';

export type JusticeReaderRow = {
    user_id: number,
    email: string,
    first_name: string,
    last_name: string,
    phone: string | null,
    position: string | null,
    role_admin: string | null,
    role_regular: string,
    user_status: string,
    id: number,
    name: string,
    abbreviation: string | null,
    type_id: number,
    being_funded: boolean,
    being_funded_at: Date,
    type_category: string,
    type_name: string,
    type_abbreviation: string | null
};

export default async (shantytownId?: number, location?: Location, userId?: number): Promise<Organization[]> => {
    const rows: JusticeReaderRow[] = await sequelize.query(
        `WITH users_by_permissions AS (
            SELECT
                fk_user,
                COUNT(CASE WHEN type = 'nation' THEN 1 ELSE NULL END) > 0 AS national,
                array_remove(array_agg(fk_region), null) AS regions,
                array_remove(array_agg(fk_departement), null) AS departements,
                array_remove(array_agg(fk_epci), null) AS epci,
                array_remove(array_agg(fk_city), null) AS cities
            FROM user_actual_permissions
            WHERE fk_feature = 'access' AND fk_entity = 'shantytown_justice' AND allowed IS TRUE
            GROUP BY fk_user
        )
        ${shantytownId ? `, shantytown_location AS (
            SELECT
                cities.code AS city,
                cities.fk_main AS cityMain,
                cities.fk_epci AS epci,
                departements.code AS departement,
                departements.fk_region AS region
            FROM shantytowns
            LEFT JOIN cities ON shantytowns.fk_city = cities.code
            LEFT JOIN departements ON cities.fk_departement = departements.code
            WHERE shantytown_id = :shantytownId
        )` : ''}

        SELECT
            users.user_id,
            users.email,
            users.first_name,
            users.last_name,
            users.phone,
            users.position,
            users.fk_role AS role_admin,
            users.fk_role_regular AS role_regular,
            users.fk_status AS user_status,
            organizations.organization_id as id,
            organizations.name,
            organizations.abbreviation,
            organizations.fk_type AS "type_id",
            organizations.being_funded,
            organizations.being_funded_at,
            organization_types.fk_category AS "type_category",
            organization_types.name_singular AS "type_name",
            organization_types.abbreviation AS "type_abbreviation"
        FROM users
        LEFT JOIN organizations ON users.fk_organization = organizations.organization_id
        LEFT JOIN organization_types ON organizations.fk_type = organization_types.organization_type_id
        LEFT JOIN users_by_permissions ON users.user_id = users_by_permissions.fk_user
        ${shantytownId ? 'LEFT JOIN shantytown_location ON TRUE' : ''}
        WHERE
            -- on ignore les utilisateurs des services de l'état et des structures nationales
            organization_types.uid NOT IN (
                SELECT DISTINCT uid FROM organization_types WHERE fk_category = 'public_establishment'
            )
            AND
            organization_types.fk_role NOT IN ('national_establisment')

            -- on ne conserve que les utilisateurs avec un compte actif et traqué
            AND
            users.fk_status = 'active'
            AND
            users.to_be_tracked IS TRUE

            -- Vérification des droits (soit national, soit sur le territoire concerné)
            AND (
                    users_by_permissions.national IS true
                OR  ${shantytownId ? 'shantytown_location.region' : ':region'} = ANY(users_by_permissions.regions)
                OR  ${shantytownId ? 'shantytown_location.departement' : ':departement'} = ANY(users_by_permissions.departements)
                OR  ${shantytownId ? 'shantytown_location.epci' : ':epci'} = ANY(users_by_permissions.epci)
                OR  ${shantytownId ? 'shantytown_location.city' : ':city'} = ANY(users_by_permissions.cities)
                ${shantytownId ? 'OR shantytown_location.cityMain = ANY(users_by_permissions.cities)' : ''} 
            )
            AND ${userId ? 'users.user_id = :userId' : 'TRUE'}
        `,
        {
            replacements: {
                shantytownId,
                region: location?.region.code || null,
                departement: location?.departement.code || null,
                epci: location?.epci.code || null,
                city: location?.city.code || null,
                cityMain: location?.city.main || null,
                userId: userId || null,
            },
            type: QueryTypes.SELECT,
        },
    );

    const hash: { [key: number]: Organization } = {};
    const organizations = rows.reduce((acc: Organization[], row: JusticeReaderRow) => {
        if (hash[row.id] === undefined) {
            hash[row.id] = {
                id: row.id,
                name: row.name,
                abbreviation: row.abbreviation,
                being_funded: row.being_funded,
                being_funded_at: row.being_funded_at,
                intervention_areas: {
                    is_national: false,
                    areas: [],
                },
                type: {
                    id: row.type_id,
                    category: row.type_category,
                    name: row.type_name,
                    abbreviation: row.type_abbreviation,
                },
                users: [],
            };
            acc.push(hash[row.id]);
        }

        hash[row.id].users.push({
            id: row.user_id,
            is_admin: row.role_admin !== null,
            role: row.role_admin || row.role_regular,
            first_name: row.first_name,
            last_name: row.last_name,
            email: row.email,
            phone: row.phone,
            position: row.position,
            expertise_topics: [],
            status: row.user_status,
        });

        return acc;
    }, [] as Organization[]);

    const interventionAreas = await interventionAreaModel.list(
        [],
        Object.keys(hash).map(id => parseInt(id, 10)),
    );
    hashAreas(interventionAreas, hash);

    return organizations;
};
