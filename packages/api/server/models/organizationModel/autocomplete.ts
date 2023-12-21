import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export type OrganizationAutocompleteRow = {
    id: number,
    name: string,
    abbreviation: string | null,
    similarity: number,
};

export default async (search: string, departementCode: string = null): Promise<OrganizationAutocompleteRow[]> => sequelize.query(
    `SELECT
        organizations.organization_id AS id,
        organizations.name,
        organizations.abbreviation,
        GREATEST(
            word_similarity(unaccent(:search), unaccent(organizations.name)),
            word_similarity(unaccent(:search), unaccent(organizations.abbreviation))
        ) AS similarity
    FROM organizations
    ${departementCode !== null
        ? `
    LEFT JOIN departements ON departements.code = :departementCode
    LEFT JOIN v_organization_areas ON v_organization_areas.organization_id = organizations.organization_id AND v_organization_areas.is_main_area IS TRUE`
        : ''
}
    WHERE
        unaccent(:search) % ANY(
            string_to_array(unaccent(organizations.name), ' ')
            ||
            string_to_array(unaccent(organizations.abbreviation), ' ')
        )
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
        },
    },
);
