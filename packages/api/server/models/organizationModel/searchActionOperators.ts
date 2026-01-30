import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import where from '#server/utils/permission/where';
import { User } from '#root/types/resources/User.d';

export type ActionOperatorOrganizationRow = {
    id: number,
    name: string,
    abbreviation: string | null,
    type: string | null,
    type_label: string | null,
    territory_label: string | null,
    enriched_name: string,
    enriched_abbreviation: string | null,
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

    let permissionSql = '';
    const permissionReplacements: any = {};

    if (!hasNationalAccess) {
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
            ia.type,
            CASE ia.type
                WHEN 'departement' THEN 'Département'
                WHEN 'region' THEN 'Région'
                WHEN 'epci' THEN 'EPCI'
                WHEN 'city' THEN 'Commune'
                WHEN 'nation' THEN 'National'
                ELSE 'Inconnu'
            END AS type_label,
            COALESCE(
                CASE ia.type
                    WHEN 'departement' THEN d.name
                    WHEN 'region' THEN r.name
                    WHEN 'epci' THEN e.name
                    WHEN 'city' THEN c.name
                    ELSE NULL
                END
            ) AS territory_label,
            -- Noms enrichis pour l'affichage
            CASE 
                WHEN ia.type = 'city' 
                THEN organizations.name
                WHEN ia.type IS NOT NULL AND COALESCE(
                    CASE ia.type
                        WHEN 'departement' THEN d.name
                        WHEN 'region' THEN r.name
                        WHEN 'epci' THEN e.name
                        ELSE NULL
                    END
                ) IS NOT NULL 
                THEN CONCAT(organizations.name, ' - ', COALESCE(
                    CASE ia.type
                        WHEN 'departement' THEN d.name
                        WHEN 'region' THEN r.name
                        WHEN 'epci' THEN e.name
                        ELSE NULL
                    END
                ))
                ELSE organizations.name
            END AS enriched_name,
            CASE 
                WHEN ia.type = 'city' 
                THEN organizations.abbreviation
                WHEN ia.type IS NOT NULL AND organizations.abbreviation IS NOT NULL AND COALESCE(
                    CASE ia.type
                        WHEN 'departement' THEN d.name
                        WHEN 'region' THEN r.name
                        WHEN 'epci' THEN e.name
                        ELSE NULL
                    END
                ) IS NOT NULL 
                THEN CONCAT(organizations.abbreviation, ' - ', COALESCE(
                    CASE ia.type
                        WHEN 'departement' THEN d.name
                        WHEN 'region' THEN r.name
                        WHEN 'epci' THEN e.name
                        ELSE NULL
                    END
                ))
                ELSE organizations.abbreviation
            END AS enriched_abbreviation,
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
