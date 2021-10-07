const permissionsDescription = require('#server/permissions_description');
const { getPermissionsFor } = require('#server/utils/permission');

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

module.exports = (user, latestCharte, filters, permissionMap) => {
    const serialized = {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        position: user.position,
        status: user.status,
        created_at: user.created_at.getTime() / 1000,
        user_access: user.user_access_id !== null ? {
            id: user.user_access_id,
            sent_by: user.activator_id !== null ? {
                id: user.activator_id,
                email: user.activator_email,
                first_name: user.activator_first_name,
                last_name: user.activator_last_name,
                position: user.activator_position,
                organization: {
                    id: user.activator_organization_id,
                    name: user.activator_organization_name,
                },
            } : null,
            used_at: user.user_access_used_at ? user.user_access_used_at.getTime() / 1000 : null,
            expires_at: user.user_access_expires_at.getTime() / 1000,
            created_at: user.user_access_created_at.getTime() / 1000,
        } : null,
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
        subscribed_to_summary: user.subscribed_to_summary,
        last_access: user.last_access !== null ? user.last_access.getTime() / 1000 : null,
        admin_comments: user.admin_comments,
        is_admin: user.is_admin,
        role: user.role_name || user.organization_type_role_name,
        role_id: user.role || user.organization_type_role,
        is_superuser: user.role === 'national_admin',
    };

    if (filters.auth === true) {
        Object.assign(serialized, {
            password: user.password,
            salt: user.salt,
        });
    }

    if (filters.extended === true) {
        const roleDescription = permissionsDescription[serialized.role_id];
        const permissions = getPermissionsFor(user, permissionMap);

        Object.assign(serialized, {
            access_request_message: user.access_request_message,
            permissions,
            permission_options: roleDescription ? roleDescription.options.reduce((options, { id }) => {
                switch (id) {
                    case 'close_shantytown':
                        if (permissions.shantytown && permissions.shantytown.close && permissions.shantytown.close.allowed) {
                            return [...options, id];
                        }
                        break;

                    case 'create_and_close_shantytown':
                        if (permissions && permissions.shantytown && permissions.shantytown.close && permissions.shantytown.close.allowed) {
                            return [...options, id];
                        }
                        break;

                    case 'hide_justice':
                        if (permissions.shantytown && permissions.shantytown.list && !permissions.shantytown.list.data_justice) {
                            return [...options, id];
                        }
                        break;

                    default:
                }

                return options;
            }, []) : [],
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
