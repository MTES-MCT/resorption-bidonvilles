import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import { Location } from '#server/models/geoModel/Location.d';
import { LocationType } from '#server/models/geoModel/LocationType.d';
import { SerializedOrganization } from '#server/models/userModel/getDirectory';

export type JusticeReaderRow = {
    user_id: number,
    email: string,
    first_name: string,
    last_name: string,
    phone: string | null,
    position: string | null,
    role_admin: string | null,
    role_regular: string,
    id: number,
    name: string,
    abbreviation: string | null,
    location_type: LocationType,
    region_code: string | null,
    region_name: string | null,
    departement_code: string | null,
    departement_name: string | null,
    epci_code: string | null,
    epci_name: string | null,
    city_code: string | null,
    city_name: string | null,
    city_main: string | null,
    type_id: number,
    being_funded: boolean,
    being_funded_at: Date,
    type_category: string,
    type_name: string,
    type_abbreviation: string | null
};

export default async (shantytownId?: number, location?: Location): Promise<SerializedOrganization[]> => {
    const rows: JusticeReaderRow[] = await sequelize.query(
        `${shantytownId ? `
        WITH location AS (
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
            uap.fk_user AS user_id,
            u.email,
            u.first_name,
            u.last_name,
            u.phone,
            u.position,
            u.fk_role AS role_admin,
            u.fk_role_regular AS role_regular,
            o.organization_id as id,
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
            o.being_funded,
            o.being_funded_at,
            ot.fk_category AS "type_category",
            ot.name_singular AS "type_name",
            ot.abbreviation AS "type_abbreviation"
        FROM user_actual_permissions uap
        ${shantytownId ? 'LEFT JOIN location ON TRUE' : ''}
        LEFT JOIN users u ON uap.fk_user = u.user_id
        LEFT JOIN localized_organizations o ON u.fk_organization = o.organization_id
        LEFT JOIN organization_types ot ON o.fk_type = ot.organization_type_id
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
            OR ${shantytownId ? 'location.region' : ':region'} = ANY(uap.regions)
                
            OR ${shantytownId ? 'location.departement' : ':departement'} = ANY(uap.departements)
            OR ${shantytownId ? 'location.epci' : ':epci'} = ANY(uap.epci)
            OR ${shantytownId ? 'location.city' : ':city'} = ANY(uap.cities)
            OR ${shantytownId ? 'location.cityMain' : ':cityMain'} = ANY(uap.cities)
            OR
                (
                    uap.regions IS NULL
                AND
                    uap.departements IS NULL
                AND
                    uap.epci IS NULL
                AND
                    uap.cities IS NULL
                AND
                    ${shantytownId ? 'location.departement' : ':departement'} = o.departement_code
                )
            OR
                (
                    uap.regions IS NULL
                AND
                    uap.departements IS NULL
                AND
                    uap.epci IS NULL
                AND
                    uap.cities IS NULL
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
                shantytownId,
                region: location?.region.code || null,
                departement: location?.departement.code || null,
                epci: location?.epci.code || null,
                city: location?.city.code || null,
                cityMain: location?.city.main || null,
            },
            type: QueryTypes.SELECT,
        },
    );

    const hash: { [key: number]: SerializedOrganization } = {};
    return rows.reduce((acc: SerializedOrganization[], row: JusticeReaderRow) => {
        if (hash[row.id] === undefined) {
            hash[row.id] = {
                id: row.id,
                name: row.name,
                abbreviation: row.abbreviation,
                being_funded: row.being_funded,
                being_funded_at: row.being_funded_at,
                location: {
                    type: row.location_type,
                    region: row.region_code !== null ? {
                        code: row.region_code,
                        name: row.region_name,
                    } : null,
                    departement: row.departement_code !== null ? {
                        code: row.departement_code,
                        name: row.departement_name,
                    } : null,
                    epci: row.epci_code !== null ? {
                        code: row.epci_code,
                        name: row.epci_name,
                    } : null,
                    city: row.city_code !== null ? {
                        code: row.city_code,
                        name: row.city_name,
                        main: row.city_main,
                    } : null,
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
        });

        return acc;
    }, [] as SerializedOrganization[]);
};
