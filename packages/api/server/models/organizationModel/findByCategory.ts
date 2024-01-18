import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

type OrganizationMin = {
    id: number,
    name: string,
    abbreviation: string | null,
};

export default (categoryUid: string, search: string = null): Promise<OrganizationMin[]> => sequelize.query(
    `SELECT
        organizations.organization_id AS id,
        organizations.name,
        organizations.abbreviation
    FROM organizations
    LEFT JOIN organization_types ON organizations.fk_type = organization_types.organization_type_id
    WHERE
        organization_types.fk_category = :categoryUid
        ${search !== null ? ' AND (UNACCENT(organizations.name) ILIKE UNACCENT(:search) OR UNACCENT(organizations.abbreviation) ILIKE UNACCENT(:search))' : ''}
    ORDER BY
        CASE organization_types.fk_category
            WHEN 'association' THEN LOWER(UNACCENT(COALESCE(organizations.abbreviation, organizations.name)))
            ELSE '' END
        ASC,
        UNACCENT(organizations.name) ASC`,
    {
        type: QueryTypes.SELECT,
        replacements: {
            categoryUid,
            search: `%${search}%`,
        },
    },
);
