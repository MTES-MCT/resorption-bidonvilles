import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import where from '#server/utils/permission/where';
import { User } from '#root/types/resources/User.d';

export type ActionOperatorOrganizationRow = {
    id: number,
    name: string,
    abbreviation: string | null,
    action_count: number,
    similarity: number,
};

async function searchActionOperators(search: string, user: User): Promise<ActionOperatorOrganizationRow[]> {
    const permissionClauseGroup = where().can(user).do('read', 'action');

    const hasNoPermissions = permissionClauseGroup === null;
    const hasNationalAccess = permissionClauseGroup !== null && Object.keys(permissionClauseGroup).length === 0;

    if (hasNoPermissions) {
        return [];
    }

    let whereClause = `
        unaccent(:search) % ANY(
            string_to_array(unaccent(organizations.name), ' ')
            ||
            string_to_array(unaccent(COALESCE(organizations.abbreviation, '')), ' ')
        )
    `;

    let replacements = { search };

    if (!hasNationalAccess) {
        let permissionSql = '';
        const permissionReplacements: any = {};

        if (permissionClauseGroup.departements) {
            permissionSql += 'a.fk_departement IN (:departements)';
            permissionReplacements.departements = permissionClauseGroup.departements.value;
        }

        if (permissionClauseGroup.actions) {
            if (permissionSql) {
                permissionSql += ' OR ';
            }
            permissionSql += 'a.action_id IN (:actions)';
            permissionReplacements.actions = permissionClauseGroup.actions.value;
        }

        whereClause += `
            AND EXISTS (
                SELECT 1
                FROM users u
                INNER JOIN action_operators ao ON ao.fk_user = u.user_id
                INNER JOIN actions a ON a.action_id = ao.fk_action
                WHERE u.fk_organization = organizations.organization_id
                AND (${permissionSql})
            )
        `;
        replacements = { ...replacements, ...permissionReplacements };
    }

    const fullSql = `SELECT
            organizations.organization_id AS id,
            organizations.name,
            organizations.abbreviation,
            0 AS action_count,
            GREATEST(
                word_similarity(unaccent(:search), unaccent(organizations.name)),
                word_similarity(unaccent(:search), unaccent(COALESCE(organizations.abbreviation, '')))
            ) AS similarity
        FROM organizations
        WHERE ${whereClause}
        ORDER BY similarity DESC
        LIMIT 10`;

    return sequelize.query<ActionOperatorOrganizationRow>(
        fullSql,
        {
            type: QueryTypes.SELECT,
            replacements,
        },
    );
}

export default searchActionOperators;
