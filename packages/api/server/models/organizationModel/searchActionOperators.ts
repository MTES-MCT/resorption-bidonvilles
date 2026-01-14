import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

export type ActionOperatorOrganizationRow = {
    id: number,
    name: string,
    abbreviation: string | null,
    action_count: number,
    similarity: number,
};

export default async (search: string): Promise<ActionOperatorOrganizationRow[]> => sequelize.query(
    `SELECT
        organizations.organization_id AS id,
        organizations.name,
        organizations.abbreviation,
        COUNT(DISTINCT action_operators.fk_action) AS action_count,
        GREATEST(
            word_similarity(unaccent(:search), unaccent(organizations.name)),
            word_similarity(unaccent(:search), unaccent(COALESCE(organizations.abbreviation, '')))
        ) AS similarity
    FROM organizations
    INNER JOIN users ON users.fk_organization = organizations.organization_id
    INNER JOIN action_operators ON action_operators.fk_user = users.user_id
    WHERE
        unaccent(:search) % ANY(
            string_to_array(unaccent(organizations.name), ' ')
            ||
            string_to_array(unaccent(COALESCE(organizations.abbreviation, '')), ' ')
        )
    GROUP BY organizations.organization_id, organizations.name, organizations.abbreviation
    ORDER BY similarity DESC, action_count DESC
    LIMIT 10
    `,
    {
        type: QueryTypes.SELECT,
        replacements: {
            search,
        },
    },
);
