import EMAIL_SUBSCRIPTIONS from '#server/config/email_subscriptions';
import serializeUserAccess from './serializeUserAccess';
import { SerializedUser, UserQuestionSubscriptions } from './types/SerializedUser';

/**
 * @typedef {Object} UserFilters
 * @property {Boolean} [extended=false] Whether extended data should be returned or not
 * @property {Boolean} [auth=false]     Whether auth data should be returned or not
 * @property {Boolean} [app=false]      Whether app version data should be returned or not
 *
 * Please find below the details about each filter:
 * - extended data is any data useful for the logged in user only. Typically, data that you
 *   would not need to display a user's profile page
 * - auth data is any private authentication material: password, salt...
 */
export default (user, latestCharte, filters, permissionMap): SerializedUser => {
    const serialized: SerializedUser = {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        position: user.position,
        status: user.status,
        created_at: user.created_at.getTime() / 1000,
        user_accesses: user.user_accesses.map(serializeUserAccess),
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
            location: {
                type: user.location_type,
                latitude: user.latitude || 46.7755829,
                longitude: user.longitude || 2.0497727,
                region: user.region_code !== null ? {
                    code: user.region_code,
                    name: user.region_name,
                } : null,
                departement: user.departement_code !== null ? {
                    code: user.departement_code,
                    name: user.departement_name,
                } : null,
                epci: user.epci_code !== null ? {
                    code: user.epci_code,
                    name: user.epci_name,
                } : null,
                city: user.city_code !== null ? {
                    code: user.city_code,
                    name: user.city_name,
                    main: user.city_main,
                } : null,
            },
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
        tags_chosen: user.tags_chosen,
        tags: [],
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
