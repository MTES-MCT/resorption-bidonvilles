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
        localized_organizations.organization_id AS id,
        localized_organizations.name,
        localized_organizations.abbreviation,
        GREATEST(
            word_similarity(unaccent(:search), unaccent(localized_organizations.name)),
            word_similarity(unaccent(:search), unaccent(localized_organizations.abbreviation))
        ) AS similarity
    FROM localized_organizations
    ${departementCode !== null ? 'LEFT JOIN departements ON departements.code = :departementCode' : ''}
    WHERE
        unaccent(:search) % ANY(
            string_to_array(unaccent(localized_organizations.name), ' ')
            ||
            string_to_array(unaccent(localized_organizations.abbreviation), ' ')
        )
        ${departementCode !== null ? `
        AND
        (localized_organizations.location_type = 'nation'
            OR
        localized_organizations.region_code = departements.fk_region)` : ''}
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
