import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';

type ActionFullName = {
    action_id: number;
    full_name: string;
};

/**
 * Récupère le nom complet des actions au format "structure - projet"
 * en utilisant l'opérateur principal (is_principal = true)
 *
 * @param actionIds - Liste des IDs d'actions pour lesquelles récupérer le nom complet
 * @returns Map avec action_id comme clé et nom complet comme valeur
 */
export const getActionFullNames = async (actionIds: number[]): Promise<Map<number, string>> => {
    if (actionIds.length === 0) {
        return new Map();
    }

    const rows: ActionFullName[] = await sequelize.query(
        `
        WITH principal_operator AS (
            SELECT
                ao.fk_action,
                COALESCE(NULLIF(org.abbreviation, ''), org."name") AS operator_name
            FROM
                action_operators ao
            INNER JOIN
                users u ON u.user_id = ao.fk_user
            INNER JOIN
                organizations org ON org.organization_id = u.fk_organization
            WHERE
                ao.is_principal = true
        )
        SELECT
            actions.action_id,
            CASE
                WHEN po.operator_name IS NOT NULL THEN 
                    UPPER(SUBSTRING(po.operator_name, 1, 1)) || SUBSTRING(po.operator_name, 2) || ' - ' || actions.name
                ELSE actions.name
            END AS full_name
        FROM
            actions
        LEFT JOIN
            principal_operator po ON po.fk_action = actions.action_id
        WHERE
            actions.action_id IN (:actionIds)
        `,
        {
            type: QueryTypes.SELECT,
            replacements: { actionIds },
        },
    );

    const result = new Map<number, string>();
    rows.forEach((row) => {
        result.set(row.action_id, row.full_name);
    });

    return result;
};

/**
 * Récupère le nom complet d'une seule action au format "structure - projet"
 *
 * @param actionId - ID de l'action
 * @returns Nom complet de l'action ou null si non trouvée
 */
export const getActionFullName = async (actionId: number): Promise<string | null> => {
    const names = await getActionFullNames([actionId]);
    return names.get(actionId) ?? null;
};
