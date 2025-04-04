import EMAIL_SUBSCRIPTIONS from '#server/config/email_subscriptions';
import { PermissionHash } from '#server/models/permissionModel/find';
import interventionAreaModel from '#server/models/interventionAreaModel/index';
import serializeUserAccess from './serializeUserAccess';
import {
    RawInterventionArea, RawUser, RawUserAccess, UserQueryFilters,
} from './query.d';
import { User, UserQuestionSubscriptions, UserExpertiseTopicType } from '#root/types/resources/User.d';

export default (user: RawUser, userAccesses: RawUserAccess[], interventionAreas: RawInterventionArea[], latestCharte: number, filters: UserQueryFilters, permissionMap: PermissionHash): User => {
    const serialized: User = {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        position: user.position,
        status: user.status,
        created_at: user.created_at.getTime() / 1000,
        user_accesses: userAccesses.map(serializeUserAccess),
        organization: {
            id: user.organization_id,
            name: user.organization_name,
            abbreviation: user.organization_abbreviation,
            active: user.organization_active,
            type: {
                id: user.organization_type_id,
                uid: user.organization_type_uid,
                name_singular: user.organization_type_name_singular,
                name_plural: user.organization_type_name_plural,
                abbreviation: user.organization_type_abbreviation,
            },
            category: {
                uid: user.organization_category_id,
                name_singular: user.organization_category_name_singular,
                name_plural: user.organization_category_name_plural,
            },
        },
        intervention_areas: {
            is_national: user.is_national,
            areas: interventionAreas.map(interventionAreaModel.serialize),
        },
        charte_engagement_a_jour: latestCharte === null || user.charte_engagement_signee === latestCharte,
        email_subscriptions: EMAIL_SUBSCRIPTIONS.filter(subscription => !user.email_unsubscriptions.includes(subscription)),
        question_subscriptions: {},
        last_access: user.last_access !== null ? user.last_access.getTime() / 1000 : null,
        admin_comments: user.admin_comments,
        is_admin: user.is_admin,
        role: user.user_role_admin_name || user.user_role_regular_name,
        role_id: user.user_role_admin || user.user_role_regular,
        is_superuser: user.user_role_admin === 'national_admin',
        expertise_topics_chosen: user.expertise_topics_chosen,
        expertise_comment: user.expertise_comment,
        expertise_topics: user.topics.map((topic) => {
            const [uid, label, type] = topic.split(',');
            return { uid, label, type: type as UserExpertiseTopicType };
        }),
        password_conformity: user.password_conformity,
        anonymized: !!user.anonymized_at,
        anonymized_at: user.anonymized_at ? user.anonymized_at.getTime() / 1000 : null,
        anonymization_requested: user.anonymization_requested,
    };

    if (filters.auth === true) {
        Object.assign(serialized, {
            password: user.password,
            salt: user.salt,
        });
    }

    if (filters.extended === true) {
        const permissions = (permissionMap && permissionMap[user.id]) || {};

        Object.assign(serialized, {
            access_request_message: user.access_request_message,
            permissions,
            permission_options: user.permission_options,
            question_subscriptions: user.question_subscriptions.reduce((acc: UserQuestionSubscriptions, col) => {
                const [questionId, active] = col.split(',');
                acc[parseInt(questionId, 10)] = active === 'true';
                return acc;
            }, {}),
        });
    }

    if (filters.app === true) {
        Object.assign(serialized, {
            last_version: user.last_version,
            last_changelog: user.last_changelog,
        });
    }

    return serialized;
};
