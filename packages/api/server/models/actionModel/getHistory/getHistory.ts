import { sequelize } from '#db/sequelize';
import { QueryTypes } from 'sequelize';
import permissionUtils from '#server/utils/permission';
import serializeAction, { ActionRow } from '../_common/serializeAction';
import getDiff from '../_common/getDiff';
import { User } from '#root/types/resources/User.d';
import Action from '#root/types/resources/Action.d';

const { can } = permissionUtils;

type ActionHistoryRow = ActionRow & {
    hid: number,
    author_first_name: string,
    author_last_name: string,
    author_organization_id: number,
    author_organization_name: string,
    author_organization_abbreviation: string | null,
};

export type ActionActivity = {
    entity: 'action',
    action: 'creation' | 'update',
    date: number,
    author: {
        first_name: string,
        last_name: string,
        organization: {
            id: number,
            name: string,
            abbreviation: string | null,
        },
    },
    actionEntity: {
        id: number,
        name: string,
    },
    diff?: Array<{
        fieldKey: string,
        field: string,
        oldValue: string,
        newValue: string,
    }>,
};

export default async function getHistory(user: User, actionId: number): Promise<ActionActivity[]> {
    // Récupérer d'abord l'action pour vérifier les permissions sur sa vraie localisation
    const actionCheck = await sequelize.query(
        `SELECT a.action_id, d.code as departement_code, d.name as departement_name, r.code as region_code, r.name as region_name
         FROM actions a
         LEFT JOIN departements d ON a.fk_departement = d.code
         LEFT JOIN regions r ON d.fk_region = r.code
         WHERE a.action_id = :actionId`,
        {
            type: QueryTypes.SELECT,
            replacements: { actionId },
        },
    );

    if (actionCheck.length === 0) {
        return [];
    }

    const actionData: any = actionCheck[0];
    const location = {
        type: 'departement' as const,
        city: null,
        epci: null,
        departement: {
            code: actionData.departement_code,
            name: actionData.departement_name,
        },
        region: {
            code: actionData.region_code,
            name: actionData.region_name,
        },
    };

    if (!can(user).do('read', 'action').on(location)) {
        return [];
    }

    const canAccessFinances = can(user).do('access', 'action_finances').on(location);

    const activitiesRaw: any[] = await sequelize.query(
        `
        (
        WITH
            action_topics_agg AS (
                SELECT
                    ath.fk_action AS hid,
                    COALESCE(
                        jsonb_agg(
                            jsonb_build_object(
                                'uid', t.uid,
                                'name', t.name
                            )
                        ) FILTER (WHERE t.uid IS NOT NULL),
                        '[]'::jsonb
                    ) AS topics
                FROM action_topics_history ath
                LEFT JOIN topics t ON ath.fk_topic = t.uid
                GROUP BY ath.fk_action
            ),
            action_managers_agg AS (
                SELECT
                    amh.fk_action AS hid,
                    COALESCE(
                        jsonb_agg(
                            jsonb_build_object(
                                'id', o.organization_id,
                                'name', o.name,
                                'abbreviation', o.abbreviation
                            )
                        ) FILTER (WHERE o.organization_id IS NOT NULL),
                        '[]'::jsonb
                    ) AS managers
                FROM action_managers_history amh
                LEFT JOIN users u ON amh.fk_user = u.user_id
                LEFT JOIN organizations o ON u.fk_organization = o.organization_id
                GROUP BY amh.fk_action
            ),
            action_operators_agg AS (
                SELECT
                    aoh.fk_action AS hid,
                    COALESCE(
                        jsonb_agg(
                            jsonb_build_object(
                                'id', o.organization_id,
                                'name', o.name,
                                'abbreviation', o.abbreviation
                            )
                        ) FILTER (WHERE o.organization_id IS NOT NULL),
                        '[]'::jsonb
                    ) AS operators
                FROM action_operators_history aoh
                LEFT JOIN users u ON aoh.fk_user = u.user_id
                LEFT JOIN organizations o ON u.fk_organization = o.organization_id
                GROUP BY aoh.fk_action
            ),
            action_shantytowns_agg AS (
                SELECT
                    ash.fk_action AS hid,
                    COALESCE(
                        jsonb_agg(
                            jsonb_build_object(
                                'id', s.shantytown_id,
                                'name', s.name,
                                'usename', COALESCE(s.name, s.address, CONCAT(c.name, ' (', s.address, ')'))
                            )
                        ) FILTER (WHERE s.shantytown_id IS NOT NULL),
                        '[]'::jsonb
                    ) AS shantytowns
                FROM action_shantytowns_history ash
                LEFT JOIN shantytowns s ON ash.fk_shantytown = s.shantytown_id
                LEFT JOIN cities c ON s.fk_city = c.code
                GROUP BY ash.fk_action
            )
            ${canAccessFinances ? `,
            action_finances_agg AS (
                SELECT
                    afh.fk_action AS hid,
                    COALESCE(
                        jsonb_object_agg(
                            afh.year::text,
                            afh.year_finances
                        ) FILTER (WHERE afh.year IS NOT NULL),
                        '{}'::jsonb
                    ) AS finances
                FROM (
                    SELECT
                        afh2.fk_action,
                        afh2.year,
                        jsonb_agg(
                            jsonb_build_object(
                                'type', jsonb_build_object(
                                    'uid', aft.uid,
                                    'name', aft.name
                                ),
                                'amount', afh2.amount,
                                'real_amount', afh2.real_amount,
                                'comments', afh2.comments
                            )
                        ) AS year_finances
                    FROM action_finances_history afh2
                    LEFT JOIN action_finance_types aft ON afh2.fk_action_finance_type = aft.uid
                    GROUP BY afh2.fk_action, afh2.year
                ) afh
                GROUP BY afh.fk_action
            )` : ''}

        SELECT
            ah.hid,
            ah.action_id,
            ah.action_ref,
            ah.name,
            ah.started_at,
            ah.ended_at,
            ah.goals,
            d.name AS departement_name,
            d.code AS departement_code,
            r.name AS region_name,
            r.code AS region_code,
            ah.location_type,
            ah.address,
            ah.latitude,
            ah.longitude,
            ah.eti_fk_city,
            ah.location_other,
            creator.user_id AS creator_id,
            creator.first_name AS creator_first_name,
            creator.last_name AS creator_last_name,
            creator.fk_organization AS creator_organization,
            editor.user_id AS editor_id,
            editor.first_name AS editor_first_name,
            editor.last_name AS editor_last_name,
            editor.fk_organization AS editor_organization,
            ah.created_by,
            ah.created_at,
            ah.updated_by,
            COALESCE(ah.updated_at, ah.created_at) AS updated_at,
            COALESCE(ah.updated_by, ah.created_by) AS authorId,
            author.first_name AS author_first_name,
            author.last_name AS author_last_name,
            author.fk_organization AS author_organization_id,
            author_org.name AS author_organization_name,
            author_org.abbreviation AS author_organization_abbreviation,
            COALESCE(topics.topics, '[]'::jsonb) AS topics,
            COALESCE(managers.managers, '[]'::jsonb) AS managers,
            COALESCE(operators.operators, '[]'::jsonb) AS operators,
            COALESCE(shantytowns.shantytowns, '[]'::jsonb) AS shantytowns
            ${canAccessFinances ? ', COALESCE(finances.finances, \'{}\'::jsonb) AS finances' : ''}
        FROM actions_history ah
        LEFT JOIN departements d ON ah.fk_departement = d.code
        LEFT JOIN regions r ON d.fk_region = r.code
        LEFT JOIN users creator ON ah.created_by = creator.user_id
        LEFT JOIN organizations creator_org ON creator.fk_organization = creator_org.organization_id
        LEFT JOIN users editor ON ah.updated_by = editor.user_id
        LEFT JOIN organizations editor_org ON editor.fk_organization = editor_org.organization_id
        LEFT JOIN users author ON COALESCE(ah.updated_by, ah.created_by) = author.user_id
        LEFT JOIN organizations author_org ON author.fk_organization = author_org.organization_id
        LEFT JOIN action_topics_agg topics ON ah.hid = topics.hid
        LEFT JOIN action_managers_agg managers ON ah.hid = managers.hid
        LEFT JOIN action_operators_agg operators ON ah.hid = operators.hid
        LEFT JOIN action_shantytowns_agg shantytowns ON ah.hid = shantytowns.hid
        ${canAccessFinances ? 'LEFT JOIN action_finances_agg finances ON ah.hid = finances.hid' : ''}
        WHERE ah.action_id = :actionId
        )
        UNION
        (
        WITH
            action_topics_agg AS (
                SELECT
                    :actionId AS hid,
                    COALESCE(
                        (
                            SELECT jsonb_agg(
                                jsonb_build_object(
                                    'uid', t.uid,
                                    'name', t.name
                                )
                            )
                            FROM action_topics at
                            LEFT JOIN topics t ON at.fk_topic = t.uid
                            WHERE at.fk_action = :actionId
                        ),
                        '[]'::jsonb
                    ) AS topics
            ),
            action_managers_agg AS (
                SELECT
                    :actionId AS hid,
                    COALESCE(
                        (
                            SELECT jsonb_agg(
                                jsonb_build_object(
                                    'id', o.organization_id,
                                    'name', o.name,
                                    'abbreviation', o.abbreviation
                                )
                            )
                            FROM action_managers am
                            LEFT JOIN users u ON am.fk_user = u.user_id
                            LEFT JOIN organizations o ON u.fk_organization = o.organization_id
                            WHERE am.fk_action = :actionId
                        ),
                        '[]'::jsonb
                    ) AS managers
            ),
            action_operators_agg AS (
                SELECT
                    :actionId AS hid,
                    COALESCE(
                        (
                            SELECT jsonb_agg(
                                jsonb_build_object(
                                    'id', o.organization_id,
                                    'name', o.name,
                                    'abbreviation', o.abbreviation
                                )
                            )
                            FROM action_operators ao
                            LEFT JOIN users u ON ao.fk_user = u.user_id
                            LEFT JOIN organizations o ON u.fk_organization = o.organization_id
                            WHERE ao.fk_action = :actionId
                        ),
                        '[]'::jsonb
                    ) AS operators
            ),
            action_shantytowns_agg AS (
                SELECT
                    :actionId AS hid,
                    COALESCE(
                        (
                            SELECT jsonb_agg(
                                jsonb_build_object(
                                    'id', s.shantytown_id,
                                    'name', s.name,
                                    'usename', COALESCE(s.name, s.address, CONCAT(c.name, ' (', s.address, ')'))
                                )
                            )
                            FROM action_shantytowns ash
                            LEFT JOIN shantytowns s ON ash.fk_shantytown = s.shantytown_id
                            LEFT JOIN cities c ON s.fk_city = c.code
                            WHERE ash.fk_action = :actionId
                        ),
                        '[]'::jsonb
                    ) AS shantytowns
            )
            ${canAccessFinances ? `,
            action_finances_agg AS (
                SELECT
                    :actionId AS hid,
                    COALESCE(
                        (
                            SELECT jsonb_object_agg(
                                af.year::text,
                                af.year_finances
                            )
                            FROM (
                                SELECT
                                    af2.year,
                                    jsonb_agg(
                                        jsonb_build_object(
                                            'type', jsonb_build_object(
                                                'uid', aft.uid,
                                                'name', aft.name
                                            ),
                                            'amount', af2.amount,
                                            'real_amount', af2.real_amount,
                                            'comments', af2.comments
                                        )
                                    ) AS year_finances
                                FROM action_finances af2
                                LEFT JOIN action_finance_types aft ON af2.fk_action_finance_type = aft.uid
                                WHERE af2.fk_action = :actionId
                                GROUP BY af2.year
                            ) af
                        ),
                        '{}'::jsonb
                    ) AS finances
            )` : ''}

        SELECT
            0 AS hid,
            a.action_id,
            a.action_ref,
            a.name,
            a.started_at,
            a.ended_at,
            a.goals,
            d.name AS departement_name,
            d.code AS departement_code,
            r.name AS region_name,
            r.code AS region_code,
            a.location_type::text::enum_actions_history_location_type AS location_type,
            a.address,
            a.latitude,
            a.longitude,
            a.eti_fk_city,
            a.location_other,
            creator.user_id AS creator_id,
            creator.first_name AS creator_first_name,
            creator.last_name AS creator_last_name,
            creator.fk_organization AS creator_organization,
            editor.user_id AS editor_id,
            editor.first_name AS editor_first_name,
            editor.last_name AS editor_last_name,
            editor.fk_organization AS editor_organization,
            a.created_by,
            a.created_at,
            a.updated_by,
            COALESCE(a.updated_at, a.created_at) AS updated_at,
            COALESCE(a.updated_by, a.created_by) AS authorId,
            author.first_name AS author_first_name,
            author.last_name AS author_last_name,
            author.fk_organization AS author_organization_id,
            author_org.name AS author_organization_name,
            author_org.abbreviation AS author_organization_abbreviation,
            COALESCE(topics.topics, '[]'::jsonb) AS topics,
            COALESCE(managers.managers, '[]'::jsonb) AS managers,
            COALESCE(operators.operators, '[]'::jsonb) AS operators,
            COALESCE(shantytowns.shantytowns, '[]'::jsonb) AS shantytowns
            ${canAccessFinances ? ', COALESCE(finances.finances, \'{}\'::jsonb) AS finances' : ''}
        FROM actions a
        LEFT JOIN departements d ON a.fk_departement = d.code
        LEFT JOIN regions r ON d.fk_region = r.code
        LEFT JOIN users creator ON a.created_by = creator.user_id
        LEFT JOIN organizations creator_org ON creator.fk_organization = creator_org.organization_id
        LEFT JOIN users editor ON a.updated_by = editor.user_id
        LEFT JOIN organizations editor_org ON editor.fk_organization = editor_org.organization_id
        LEFT JOIN users author ON COALESCE(a.updated_by, a.created_by) = author.user_id
        LEFT JOIN organizations author_org ON author.fk_organization = author_org.organization_id
        LEFT JOIN action_topics_agg topics ON a.action_id = topics.hid
        LEFT JOIN action_managers_agg managers ON a.action_id = managers.hid
        LEFT JOIN action_operators_agg operators ON a.action_id = operators.hid
        LEFT JOIN action_shantytowns_agg shantytowns ON a.action_id = shantytowns.hid
        ${canAccessFinances ? 'LEFT JOIN action_finances_agg finances ON a.action_id = finances.hid' : ''}
        WHERE a.action_id = :actionId
        )
        ORDER BY updated_at ASC, hid DESC
        `,
        {
            type: QueryTypes.SELECT,
            replacements: { actionId },
        },
    );

    // Parser les colonnes JSONB qui peuvent être retournées comme des strings
    const activities: ActionHistoryRow[] = activitiesRaw.map((row: any) => ({
        ...row,
        topics: typeof row.topics === 'string' ? JSON.parse(row.topics) : row.topics,
        managers: typeof row.managers === 'string' ? JSON.parse(row.managers) : row.managers,
        operators: typeof row.operators === 'string' ? JSON.parse(row.operators) : row.operators,
        shantytowns: typeof row.shantytowns === 'string' ? JSON.parse(row.shantytowns) : row.shantytowns,
        finances: row.finances && typeof row.finances === 'string' ? JSON.parse(row.finances) : row.finances,
    }));

    const previousVersions: { [key: number]: Action } = {};

    return activities
        .map((activity: ActionHistoryRow) => {
            const serializedAction = serializeAction(activity, user);
            const previousVersion = previousVersions[activity.action_id] ?? null;
            previousVersions[activity.action_id] = serializedAction;

            const base = {
                entity: 'action' as const,
                date: activity.updated_at.getTime() / 1000,
                author: {
                    first_name: activity.author_first_name,
                    last_name: activity.author_last_name,
                    organization: {
                        id: activity.author_organization_id,
                        name: activity.author_organization_name,
                        abbreviation: activity.author_organization_abbreviation,
                    },
                },
                actionEntity: {
                    id: activity.action_id,
                    name: activity.name,
                },
            };

            if (previousVersion === null) {
                return { ...base, action: 'creation' as const };
            }

            const diff = getDiff(previousVersion, serializedAction);
            if (diff.length === 0) {
                return null;
            }

            return { ...base, action: 'update' as const, diff };
        })
        .filter(activity => activity !== null) as ActionActivity[];
}
