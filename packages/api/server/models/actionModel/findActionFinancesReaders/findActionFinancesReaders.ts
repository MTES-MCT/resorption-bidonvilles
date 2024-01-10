import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import { LocationType } from '#server/models/geoModel/LocationType.d';
import { SerializedOrganization } from '#server/models/userModel/getDirectory';

export type ActionFinancesReaderRow = {
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

export default async (actionId?: number, managers?: number[]): Promise<SerializedOrganization[]> => {
    const rows: ActionFinancesReaderRow[] = await sequelize.query(
        `${actionId ? `
        WITH location AS (
            SELECT
                departements.code AS departement,
                departements.fk_region AS region
            FROM actions
            LEFT JOIN departements ON actions.fk_departement = departements.code
            WHERE action_id = :actionId
        )` : ''}
        SELECT
            uap.user_id AS user_id,
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
        FROM users u
        ${actionId ? 'LEFT JOIN location ON TRUE' : ''}
        LEFT JOIN
            user_actual_permissions uap ON u.user_id = uap.user_id AND uap.entity = 'action_finances' AND  uap.feature = 'access'
        LEFT JOIN
            localized_organizations o ON u.fk_organization = o.organization_id
        LEFT JOIN
            organization_types ot ON o.fk_type = ot.organization_type_id
        WHERE
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
                u.fk_status = 'active'
            AND
                u.to_be_tracked IS true
            AND (
                ${managers ? `
                u.fk_organization IN (SELECT fk_organization FROM users WHERE user_id IN (:managers))
                ` : `
                uap.allowed IS true
                AND (
                    allow_all IS true
                    OR location.region = ANY(uap.regions)
                    OR location.departement = ANY(uap.departements)
                    OR :actionId = ANY(uap.actions)
                )`}
            )
        `,
        {
            replacements: {
                actionId,
                managers,
            },
            type: QueryTypes.SELECT,
        },
    );

    const hash: { [key: number]: SerializedOrganization } = {};
    return rows.reduce((acc: SerializedOrganization[], row: ActionFinancesReaderRow) => {
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
            expertise_topics: [],
        });

        return acc;
    }, [] as SerializedOrganization[]);
};
