import { sequelize } from '#db/sequelize';
import { QueryTypes, Transaction } from 'sequelize';
import charteEngagementModel from '#server/models/charteEngagementModel';
import permissionModel from '#server/models/permissionModel';
import permissionUtils from '#server/utils/permission';
import { Where } from '#server/models/_common/types/Where';
import { PermissionHash } from '#server/models/permissionModel/find';
import interventionAreaModel from '#server/models/interventionAreaModel/index';
import serializeUser from './serializeUser';
import { User } from '#root/types/resources/User.d';
import {
    UserQueryFilters, RawUserAccess, RawUser, RawInterventionArea,
} from './query.d';

const { getPermission } = permissionUtils;

export default async (where: Where | String = [], filters: UserQueryFilters = {}, user: User = null, feature: string = undefined, transaction: Transaction = undefined): Promise<User[]> => {
    const replacements = {};

    const strWhere = typeof where === 'string' ? where : '';
    const arrWhere = Array.isArray(where) ? where : [];
    if (user !== null) {
        const permission = getPermission(user, feature, 'user');
        if (permission === null) {
            return [];
        }

        if (permission.allowed_on_national !== true) {
            const clauseGroup = {};
            ['regions', 'departements', 'epci', 'cities'].forEach((column) => {
                if (permission.allowed_on[column]?.length <= 0) {
                    return;
                }

                clauseGroup[column] = {
                    value: permission.allowed_on[column].map(l => l[l.type].code),
                    query: `user_intervention_areas.${column}::text[]`,
                    arrayOperator: true,
                    operator: '&&',
                };
            });

            if (Object.keys(clauseGroup).length > 0) {
                arrWhere.push(clauseGroup);
            }
        }
    }

    const finalArrWhere = arrWhere.map((clauses, index) => {
        const clauseGroup = Object.keys(clauses).map((column) => {
            replacements[`${column}${index}`] = clauses[column].value !== undefined ? clauses[column].value : clauses[column];
            if (clauses[column].anyOperator !== undefined) {
                const clause = `(:${column}${index}) ${clauses[column].anyOperator} ANY(${clauses[column].query || `users.${column}`})`;
                if (clauses[column].not === true) {
                    return `NOT(${clause})`;
                }

                return clause;
            }

            if (replacements[`${column}${index}`] === null) {
                return `${clauses[column].query || `users.${column}`} IS ${clauses[column].not === true ? 'NOT ' : ''}NULL`;
            }

            return `${clauses[column].query || `users.${column}`} ${clauses[column].not === true ? 'NOT ' : ''}${clauses[column].operator || 'IN'} ${clauses[column].arrayOperator ? `ARRAY[:${column}${index}]` : `(:${column}${index})`}`;
        }).join(' OR ');

        return `(${clauseGroup})`;
    });
    if (strWhere.length > 0) {
        finalArrWhere.push(strWhere);
    }

    const whereClause = finalArrWhere.join(' AND ');

    const charte = await charteEngagementModel.getLatest();
    let latestCharte: number = null;
    if (charte !== null) {
        latestCharte = charte.version;
    }

    const users: RawUser[] = await sequelize.query(
        `WITH user_options AS (
            SELECT fk_user, ARRAY_AGG(fk_option) AS options FROM user_permission_options GROUP BY fk_user
        ),
        email_unsubscriptions AS (
            SELECT fk_user, ARRAY_AGG(email_subscription) AS unsubscriptions FROM user_email_unsubscriptions GROUP BY fk_user
        ),
        question_subscriptions AS (
            SELECT fk_user, ARRAY_AGG(fk_question::text || ',' || active::text) AS subscriptions FROM user_question_subscriptions GROUP BY fk_user
        ),
        user_expertise_topics AS (
            SELECT
                user_to_expertise_topics.fk_user,
                ARRAY_AGG(expertise_topics.uid || ',' || expertise_topics.label || ',' || user_to_expertise_topics.type) AS topics
            FROM user_to_expertise_topics
            LEFT JOIN expertise_topics ON user_to_expertise_topics.fk_expertise_topic = expertise_topics.uid
            GROUP BY user_to_expertise_topics.fk_user
        ),
        user_intervention_areas AS (
            SELECT
                users.user_id,
                COUNT(CASE WHEN intervention_areas.type = 'nation' THEN 1 ELSE null END) > 0 AS is_national,
                array_remove(array_agg(intervention_areas.fk_region), NULL) AS regions,
                array_remove(array_agg(intervention_areas.fk_departement), NULL) AS departements,
                array_remove(array_agg(intervention_areas.fk_epci), NULL) AS epci,
                array_remove(array_agg(intervention_areas.fk_city), NULL) AS cities
            FROM users
            LEFT JOIN intervention_areas ON (
                users.user_id = intervention_areas.fk_user
                OR (users.use_custom_intervention_area IS FALSE AND users.fk_organization = intervention_areas.fk_organization)
            )
            WHERE intervention_areas.is_main_area IS TRUE
            GROUP BY users.user_id
        )

        SELECT
            users.user_id AS id,
            users.first_name,
            users.last_name,
            users.email,
            users.phone,
            users.position,
            users.password,
            users.salt,
            users.access_request_message,
            users.fk_status AS status,
            users.created_at,
            users.last_version,
            users.last_changelog,
            users.charte_engagement_signee,
            users.expertise_topics_chosen,
            users.expertise_comment,
            COALESCE(user_expertise_topics.topics, array[]::text[]) AS topics,
            COALESCE(email_unsubscriptions.unsubscriptions, array[]::enum_user_email_subscriptions_email_subscription[]) AS email_unsubscriptions,
            COALESCE(question_subscriptions.subscriptions, array[]::text[]) AS question_subscriptions,
            users.last_access,
            users.admin_comments,
            user_intervention_areas.is_national,
            users.use_custom_intervention_area,
            CASE WHEN users.fk_role IS NULL THEN FALSE
                ELSE TRUE
            END AS is_admin,
            users.fk_role AS user_role_admin,
            roles_admin.name AS user_role_admin_name,
            organizations.organization_id,
            organizations.name AS organization_name,
            organizations.abbreviation AS organization_abbreviation,
            organizations.active AS organization_active,
            organization_types.organization_type_id,
            organization_types.uid AS organization_type_uid,
            organization_types.name_singular AS organization_type_name_singular,
            organization_types.name_plural AS organization_type_name_plural,
            organization_types.abbreviation AS organization_type_abbreviation,
            users.fk_role_regular AS user_role_regular,
            roles_regular.name AS user_role_regular_name,
            organization_categories.uid AS organization_category_id,
            organization_categories.name_singular AS organization_category_name_singular,
            organization_categories.name_plural AS organization_category_name_plural,
            COALESCE(user_options.options, array[]::varchar[]) AS permission_options
        FROM
            users
        LEFT JOIN
            last_user_accesses ON last_user_accesses.fk_user = users.user_id
        LEFT JOIN
            roles_admin ON users.fk_role = roles_admin.role_id
        LEFT JOIN organizations ON users.fk_organization = organizations.organization_id
        LEFT JOIN user_intervention_areas ON users.user_id = user_intervention_areas.user_id
        LEFT JOIN
            organization_types ON organizations.fk_type = organization_types.organization_type_id
        LEFT JOIN
            organization_categories ON organization_types.fk_category = organization_categories.uid
        LEFT JOIN
            roles_regular ON users.fk_role_regular = roles_regular.role_id
        LEFT JOIN
            user_options ON user_options.fk_user = users.user_id
        LEFT JOIN
            email_unsubscriptions ON email_unsubscriptions.fk_user = users.user_id
        LEFT JOIN
            question_subscriptions ON question_subscriptions.fk_user = users.user_id
        LEFT JOIN
            user_expertise_topics ON user_expertise_topics.fk_user = users.user_id
        ${whereClause.length > 0 ? `WHERE ${whereClause}` : ''}
        ORDER BY
            CASE
                WHEN
                    users.fk_status = 'new' AND last_user_accesses.user_access_id IS NULL
                    THEN 4
                WHEN users.fk_status = 'new' AND last_user_accesses.expires_at < NOW()::date
                    THEN 3
                WHEN users.fk_status = 'new' AND last_user_accesses.expires_at > NOW()::date
                    THEN 2
                ELSE 1
            END DESC,
            users.created_at DESC,
            upper(users.last_name) ASC,
            upper(users.first_name) ASC`,
        {
            type: QueryTypes.SELECT,
            replacements,
            transaction,
        },
    );

    if (users.length === 0) {
        return [];
    }

    const userAccessesPromise: Promise<RawUserAccess[]> = sequelize.query(
        `SELECT
            user_accesses.fk_user,
            user_accesses.user_access_id,
            user_accesses.used_at AS user_access_used_at,
            user_accesses.expires_at AS user_access_expires_at,
            user_accesses.created_at AS user_access_created_at,
            activator.user_id AS activator_id,
            activator.email AS activator_email,
            activator.first_name AS activator_first_name,
            activator.last_name AS activator_last_name,
            activator.position AS activator_position,
            activator_organization.organization_id AS activator_organization_id,
            activator_organization.name AS activator_organization_name
        FROM user_accesses
        LEFT JOIN
            users AS activator ON user_accesses.sent_by = activator.user_id
        LEFT JOIN
            organizations AS activator_organization ON activator.fk_organization = activator_organization.organization_id
        WHERE user_accesses.fk_user IN (:userIds)
        ORDER BY user_accesses.fk_user ASC, user_accesses.created_at DESC`,
        {
            type: QueryTypes.SELECT,
            replacements: {
                userIds: users.map(({ id }) => id),
            },
            transaction,
        },
    );

    const [userAccesses, interventionAreas] = await Promise.all([
        userAccessesPromise,
        interventionAreaModel.list(
            users.map(({ id }) => id),
            users.map(({ organization_id }) => organization_id),
            transaction,
        ),
    ]);

    const hashedUserAccesses = userAccesses.reduce((acc, row) => {
        if (acc[row.fk_user] === undefined) {
            acc[row.fk_user] = [];
        }

        acc[row.fk_user].push(row);
        return acc;
    }, {} as {
        [key: number]: RawUserAccess[]
    });

    const hashInterventionAreas = interventionAreas.reduce((acc, row) => {
        const key = row.fk_user !== null ? 'users' : 'organizations';
        const id = row.fk_user !== null ? row.fk_user : row.fk_organization;
        if (acc[key][id] === undefined) {
            acc[key][id] = [];
        }

        acc[key][id].push(row);
        return acc;
    }, {
        users: [],
        organizations: [],
    } as {
        users: { [key: number]: RawInterventionArea[] },
        organizations: { [key: number]: RawInterventionArea[] },
    });

    let permissionMap: PermissionHash = null;
    if (filters.extended === true) {
        permissionMap = await permissionModel.find(users.map(({ id }) => id));
    }

    return users.map(row => serializeUser(
        row,
        hashedUserAccesses[row.id] || [],
        (hashInterventionAreas.users[row.id] || []).concat(
            row.use_custom_intervention_area !== true ? hashInterventionAreas.organizations[row.organization_id] || [] : [],
        ),
        latestCharte,
        filters,
        permissionMap,
    ));
};
