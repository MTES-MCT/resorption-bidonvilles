import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export type UserAutocompleteRow = {
    id: number,
    first_name: string,
    last_name: string,
    organization_id: number,
    organization_name: string,
    organization_abbreviation: string | null,
    similarity: number,
};

export default async (search: string, departementCode: string = null): Promise<UserAutocompleteRow[]> => sequelize.query(
    `SELECT
        users.user_id AS id,
        users.first_name,
        users.last_name,
        users.fk_organization AS organization_id,
        localized_organizations.name AS organization_name,
        localized_organizations.abbreviation AS organization_abbreviation,
        GREATEST(
            word_similarity(unaccent(:search), unaccent(users.first_name)),
            word_similarity(unaccent(:search), unaccent(users.last_name))
        ) AS similarity
    FROM users
    LEFT JOIN localized_organizations ON users.fk_organization = localized_organizations.organization_id
    ${departementCode !== null ? 'LEFT JOIN departements ON departements.code = :departementCode' : ''}
    WHERE
        users.fk_status = 'active'
        AND
        users.to_be_tracked = TRUE
        AND
        unaccent(:search) % ANY(
            string_to_array(unaccent(users.first_name), ' ')
            ||
            string_to_array(unaccent(users.last_name), ' ')
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
