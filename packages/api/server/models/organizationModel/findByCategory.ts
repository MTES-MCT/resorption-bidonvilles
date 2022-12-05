import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export default async (categoryUid, search = null) => {
    const rows = await sequelize.query(
        `SELECT
                organizations.organization_id AS id,
                organizations.name,
                organizations.abbreviation,
                organizations.location_type,
                organizations."region_code",
                organizations."region_name",
                organizations."departement_code",
                organizations."departement_name",
                organizations."epci_code",
                organizations."epci_name",
                organizations."city_code",
                organizations."city_name"
            FROM localized_organizations AS organizations
            LEFT JOIN organization_types ON organizations.fk_type = organization_types.organization_type_id
            WHERE
                organization_types.fk_category = :categoryUid
                ${search !== null ? ' AND (UNACCENT(organizations.name) ILIKE UNACCENT(:search) OR UNACCENT(organizations.abbreviation) ILIKE UNACCENT(:search))' : ''}
            ORDER BY
                CASE organization_types.fk_category
                    WHEN 'association' THEN LOWER(UNACCENT(organizations.name))
                    ELSE '' END
                ASC,
                departement_code ASC, UNACCENT(region_name) ASC, UNACCENT(epci_name) ASC, UNACCENT(city_name) ASC`,
        {
            type: QueryTypes.SELECT,
            replacements: {
                categoryUid,
                search: `%${search}%`,
            },
        },
    );

    return rows.map((row: any) => ({
        id: row.id,
        name: row.name,
        abbreviation: row.abbreviation,
        location: {
            type: row.location_type,
            region: {
                code: row.region_code,
                name: row.region_name,
            },
            departement: {
                code: row.departement_code,
                name: row.departement_name,
            },
            epci: {
                code: row.epci_code,
                name: row.epci_name,
            },
            city: {
                code: row.city_code,
                name: row.city_name,
            },
        },
    }));
};
