import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import where from '#server/utils/permission/where';
import { User } from '#root/types/resources/User.d';

export type ActionOperatorOrganizationRow = {
    id: number,
    name: string,
    abbreviation: string | null,
    territory_type: string | null,
    territory_name: string | null,
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
        (
            unaccent(:search) % ANY(
                string_to_array(unaccent(organizations.name), ' ')
                ||
                string_to_array(unaccent(COALESCE(organizations.abbreviation, '')), ' ')
            )
            OR unaccent(organizations.name) ILIKE unaccent(:search_pattern)
            OR unaccent(COALESCE(organizations.abbreviation, '')) ILIKE unaccent(:search_pattern)
        )
    `;

    let replacements = {
        search,
        search_pattern: `%${search}%`,
    };

    let permissionSql: string = '';
    const permissionReplacements: Record<string, (string | number)[]> = {};

    if (!hasNationalAccess) {
        if (permissionClauseGroup.departements) {
            permissionSql += 'a.fk_departement IN (:departements)';
            permissionReplacements.departements = permissionClauseGroup.departements.value as (string | number)[];
        }

        if (permissionClauseGroup.actions) {
            if (permissionSql) {
                permissionSql += ' OR ';
            }
            permissionSql += 'a.action_id IN (:actions)';
            permissionReplacements.actions = permissionClauseGroup.actions.value as (string | number)[];
        }
    }

    whereClause += `
        AND EXISTS (
            SELECT 1
            FROM users u
            INNER JOIN action_operators ao ON ao.fk_user = u.user_id
            INNER JOIN actions a ON a.action_id = ao.fk_action
            WHERE u.fk_organization = organizations.organization_id
            ${permissionSql ? `AND (${permissionSql})` : ''}
        )
    `;
    replacements = { ...replacements, ...permissionReplacements };

    const fullSql = `SELECT
            organizations.organization_id AS id,
            organizations.name,
            organizations.abbreviation,
            ia.type AS territory_type,
            COALESCE(d.name, r.name, e.name, c.name) AS territory_name,
            GREATEST(
                word_similarity(unaccent(:search), unaccent(organizations.name)),
                word_similarity(unaccent(:search), unaccent(COALESCE(organizations.abbreviation, '')))
            ) AS similarity
        FROM organizations
        LEFT JOIN intervention_areas ia ON ia.fk_organization = organizations.organization_id
        LEFT JOIN departements d ON ia.type = 'departement' AND d.code = ia.fk_departement
        LEFT JOIN regions r ON ia.type = 'region' AND r.code = ia.fk_region
        LEFT JOIN epci e ON ia.type = 'epci' AND e.code = ia.fk_epci
        LEFT JOIN cities c ON ia.type = 'city' AND c.code = ia.fk_city
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
