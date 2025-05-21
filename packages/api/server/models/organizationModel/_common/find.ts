import { QueryTypes, type Transaction } from 'sequelize';
import { sequelize } from '#db/sequelize';
import hashAreas from '#server/models/interventionAreaModel/hash';
import listInterventionAreas from '#server/models/interventionAreaModel/list';

import { UserExpertiseTopic, UserExpertiseTopicType } from '#root/types/resources/User.d';
import { Organization } from '#root/types/resources/Organization.d';

type OrganizationRow = {
    organization_id: number,
    name: string,
    abbreviation: string | null,
    being_funded: boolean,
    being_funded_at: Date,
    user_id: number,
    user_role_admin: string | null,
    user_firstName: string,
    user_lastName: string,
    user_email: string,
    user_phone: string | null,
    user_position: string,
    user_topics: (`${string};${UserExpertiseTopicType};${string}`)[],
    user_role_regular: string,
    user_status: string,
    user_to_be_tracked: boolean,
    type_id: number,
    type_category: string,
    type_name: string,
    type_abbreviation: string | null,
};

type OrganizationFindOptions = {
    ids?: number[],
    activeOnly?: boolean,
    nonEmpty?: boolean,
};

export default async (options: OrganizationFindOptions = {}, transaction?: Transaction): Promise<Organization[]> => {
    const where = [];
    const replacements: any = {};
    if (options.ids !== undefined && options.ids?.length > 0) {
        where.push('organizations.organization_id IN (:ids)');
        replacements.ids = options.ids;
    }

    if (options.nonEmpty === true) {
        where.push(`
            organizations.active = TRUE
            AND
            users.fk_status = 'active'
            AND
            users.to_be_tracked = TRUE
        `);
    }

    const users: OrganizationRow[] = await sequelize.query(
        `
        WITH users_with_expertise_topics AS (
            SELECT
                utet.fk_user,
                array_agg(utet.fk_expertise_topic || ';' || utet."type" || ';' || et.label) AS topics
            FROM user_to_expertise_topics utet
            LEFT JOIN expertise_topics et ON et.uid = utet.fk_expertise_topic
            GROUP BY utet.fk_user
        )

        SELECT
            organizations.organization_id,
            organizations.name,
            organizations.abbreviation,
            organizations.being_funded,
            organizations.being_funded_at,
            users.user_id AS "user_id",
            user_roles_admin.name AS "user_role_admin",
            users.first_name AS "user_firstName",
            users.last_name AS "user_lastName",
            users.email AS "user_email",
            users.phone AS "user_phone",
            users.position AS "user_position",
            users.fk_status AS "user_status",
            users.to_be_tracked AS "user_to_be_tracked",
            COALESCE(user_expertise_topics.topics, array[]::text[]) AS "user_topics",
            user_roles_regular.name AS user_role_regular,
            organizations.fk_type AS "type_id",
            organization_types.fk_category AS "type_category",
            organization_types.name_singular AS "type_name",
            organization_types.abbreviation AS "type_abbreviation"
        FROM organizations
        LEFT JOIN users ON users.fk_organization = organizations.organization_id
        LEFT JOIN organization_types ON organizations.fk_type = organization_types.organization_type_id
        LEFT JOIN roles_regular AS user_roles_regular ON users.fk_role_regular = user_roles_regular.role_id
        LEFT JOIN roles_admin AS user_roles_admin ON users.fk_role = user_roles_admin.role_id
        LEFT JOIN users_with_expertise_topics AS user_expertise_topics ON users.user_id = user_expertise_topics.fk_user
        ${where.length > 0
        ? `WHERE ${where.map((condition, index) => (index === 0 ? condition : `AND ${condition}`)).join(' ')}`
        : ''}
        ORDER BY organizations.name, users.last_name, users.first_name
        `,
        {
            type: QueryTypes.SELECT,
            replacements,
            transaction,
        },
    );

    const hash: { [key: number]: Organization } = {};
    const organizations: Organization[] = [];
    users.forEach((user: OrganizationRow) => {
        if (hash[user.organization_id] === undefined) {
            hash[user.organization_id] = {
                id: user.organization_id,
                name: user.name,
                abbreviation: user.abbreviation,
                being_funded: user.being_funded,
                being_funded_at: user.being_funded_at,
                // cette propriété est set avec les vraies données ci-dessous
                intervention_areas: {
                    is_national: false,
                    areas: [],
                },
                type: {
                    id: user.type_id,
                    category: user.type_category,
                    name: user.type_name,
                    abbreviation: user.type_abbreviation,
                },
                users: [],
            };
            organizations.push(hash[user.organization_id]);
        }

        if (user.user_id !== null && (options.activeOnly ? user.user_status === 'active' && user.user_to_be_tracked : true)) {
            hash[user.organization_id].users.push({
                id: user.user_id,
                is_admin: user.user_role_admin !== null,
                role: user.user_role_admin || user.user_role_regular,
                first_name: user.user_firstName,
                last_name: user.user_lastName,
                email: user.user_email,
                phone: user.user_phone,
                position: user.user_position,
                expertise_topics: user.user_topics.map((topic): UserExpertiseTopic => {
                    const [uid, type, label] = topic.split(';') as [string, UserExpertiseTopicType, string];
                    return { uid, type, label };
                }),
                status: user.user_status,
            });
        }
    });

    const interventionAreas = await listInterventionAreas(
        [],
        Object.keys(hash).map(id => parseInt(id, 10)),
        transaction,
    );
    hashAreas(interventionAreas, hash);

    return organizations;
};
