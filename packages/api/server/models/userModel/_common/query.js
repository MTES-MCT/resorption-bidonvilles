const { sequelize } = require('#db/models');
const charteEngagementModel = require('#server/models/charteEngagementModel')();
const permissionModel = require('#server/models/permissionModel')();
const serializeUser = require('./serializeUser');

module.exports = async (where = [], filters, user = null, feature) => {
    const replacements = {};

    if (user !== null) {
        if (!user.permissions.user || !user.permissions.user[feature]) {
            return [];
        }

        const featureLevel = user.permissions.user[feature].geographic_level;
        const userLevel = user.organization.location.type;

        if (featureLevel !== 'nation' && (featureLevel !== 'local' || userLevel !== 'nation')) {
            if (user.organization.location.region === null) {
                return [];
            }

            where.push({
                location: {
                    query: 'organizations.region_code',
                    value: user.organization.location.region.code,
                },
            });
        }
    }

    const whereClause = where.map((clauses, index) => {
        const clauseGroup = Object.keys(clauses).map((column) => {
            replacements[`${column}${index}`] = clauses[column].value || clauses[column];
            return `${clauses[column].query || `users.${column}`} ${clauses[column].operator || 'IN'} (:${column}${index})`;
        }).join(' OR ');

        return `(${clauseGroup})`;
    }).join(' AND ');

    const charte = await charteEngagementModel.getLatest();
    let latestCharte = null;
    if (charte !== null) {
        latestCharte = charte.version;
    }

    const users = await sequelize.query(
        `SELECT
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
            users.subscribed_to_summary,
            users.last_access,
            users.admin_comments,
            CASE WHEN users.fk_role IS NULL THEN FALSE
                ELSE TRUE
            END AS is_admin,
            users.fk_role AS role,
            roles_admin.name AS role_name,
            organizations.organization_id,
            organizations.name AS organization_name,
            organizations.abbreviation AS organization_abbreviation,
            organizations.location_type,
            organizations.active AS organization_active,
            organizations.region_code,
            organizations.region_name,
            organizations.departement_code,
            organizations.departement_name,
            organizations.epci_code,
            organizations.epci_name,
            organizations.city_code,
            organizations.city_name,
            organizations.city_main,
            organizations.latitude,
            organizations.longitude,
            organization_types.organization_type_id,
            organization_types.uid AS organization_type_uid,
            organization_types.name_singular AS organization_type_name_singular,
            organization_types.name_plural AS organization_type_name_plural,
            organization_types.abbreviation AS organization_type_abbreviation,
            organization_types.fk_role AS organization_type_role,
            roles_regular.name AS organization_type_role_name,
            organization_categories.uid AS organization_category_id,
            organization_categories.name_singular AS organization_category_name_singular,
            organization_categories.name_plural AS organization_category_name_plural,
            last_user_accesses.user_access_id,
            last_user_accesses.used_at AS user_access_used_at,
            last_user_accesses.expires_at AS user_access_expires_at,
            last_user_accesses.created_at AS user_access_created_at,
            activator.user_id AS activator_id,
            activator.email AS activator_email,
            activator.first_name AS activator_first_name,
            activator.last_name AS activator_last_name,
            activator.position AS activator_position,
            activator_organization.organization_id AS activator_organization_id,
            activator_organization.name AS activator_organization_name
        FROM
            users
        LEFT JOIN
            last_user_accesses ON last_user_accesses.fk_user = users.user_id
        LEFT JOIN
            roles_admin ON users.fk_role = roles_admin.role_id
        LEFT JOIN
            localized_organizations AS organizations ON users.fk_organization = organizations.organization_id
        LEFT JOIN
            organization_types ON organizations.fk_type = organization_types.organization_type_id
        LEFT JOIN
            organization_categories ON organization_types.fk_category = organization_categories.uid
        LEFT JOIN
            users AS activator ON last_user_accesses.sent_by = activator.user_id
        LEFT JOIN
            organizations AS activator_organization ON activator.fk_organization = activator_organization.organization_id
        LEFT JOIN
            roles_regular ON organization_types.fk_role = roles_regular.role_id
        ${where.length > 0 ? `WHERE ${whereClause}` : ''}
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
            type: sequelize.QueryTypes.SELECT,
            replacements,
        },
    );

    if (users.length === 0) {
        return [];
    }

    let permissionMap = null;
    if (filters.extended === true) {
        const permissionOwners = users.reduce((acc, row) => {
            if (row.is_admin === true) {
                if (!Object.prototype.hasOwnProperty.call(acc, 'role_admin')) {
                    acc.role_admin = [];
                }

                acc.role_admin.push(row.role);
            } else {
                if (acc.organization.indexOf(row.organization_id) === -1) {
                    acc.organization.push(row.organization_id);
                }

                if (acc.role_regular.indexOf(row.organization_type_role) === -1) {
                    acc.role_regular.push(row.organization_type_role);
                }
            }

            return acc;
        }, {
            organization: [],
            role_regular: [],
        });

        permissionMap = await permissionModel.find(permissionOwners);
    }

    return users.map(row => serializeUser(row, latestCharte, filters, permissionMap));
};
