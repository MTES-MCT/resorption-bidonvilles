import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export type OrganizationAutocompleteRow = {
    id: number,
    name: string,
    abbreviation: string | null,
    departements: string[],
    similarity: number,
    type_name: string,
};

export default async (search: string, departementCode: string = null, organizationCategoryUid: string = null): Promise<OrganizationAutocompleteRow[]> => sequelize.query(
    `SELECT
        organizations.organization_id AS id,
        organizations.name,
        organizations.abbreviation,
        organization_types.name_singular AS type_name,
        COALESCE(v_organization_areas.departements, ARRAY[]::varchar[]) AS departements,
        GREATEST(
            word_similarity(unaccent(:search), unaccent(organizations.name)),
            word_similarity(unaccent(:search), unaccent(organizations.abbreviation))
        ) AS similarity
    FROM organizations
    LEFT JOIN organization_types ON organizations.fk_type = organization_types.organization_type_id
    LEFT JOIN v_organization_areas ON v_organization_areas.organization_id = organizations.organization_id AND v_organization_areas.is_main_area IS TRUE
    ${departementCode !== null
        ? `
    LEFT JOIN departements ON departements.code = :departementCode
    `
        : ''
}
    WHERE
        unaccent(:search) % ANY(
            string_to_array(unaccent(organizations.name), ' ')
            ||
            string_to_array(unaccent(organizations.abbreviation), ' ')
        )
        ${organizationCategoryUid !== null ? 'AND organization_types.fk_category = :organizationCategoryUid' : ''}
        ${departementCode !== null ? `
        AND
        (v_organization_areas.is_national IS TRUE
            OR
            departements.fk_region = ANY(v_organization_areas.regions))` : ''}
    ORDER BY similarity DESC
    `,
    {
        type: QueryTypes.SELECT,
        replacements: {
            search,
            departementCode,
            organizationCategoryUid,
        },
    },
);
