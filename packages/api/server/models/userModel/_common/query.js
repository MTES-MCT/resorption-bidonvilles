const { sequelize } = require('#db/models');
const charteEngagementModel = require('#server/models/charteEngagementModel')();
const permissionModel = require('#server/models/permissionModel')();
const serializeUser = require('./serializeUser');
const { where: fWhere } = require('#server/utils/permission');

module.exports = async (where = [], filters, user = null, feature, transaction) => {
    const replacements = {};

    if (user !== null) {
        const permissionClauseGroup = fWhere().can(user).do(feature, 'user');
        if (permissionClauseGroup === null) {
            return [];
        }

        if (Object.keys(permissionClauseGroup).length > 0) {
            where.push(permissionClauseGroup);
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
        `WITH user_options AS (
            SELECT fk_user, ARRAY_AGG(fk_option) AS options FROM user_permission_options GROUP BY fk_user
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
            users.subscribed_to_summary,
            users.last_access,
            users.admin_comments,
            CASE WHEN users.fk_role IS NULL THEN FALSE
                ELSE TRUE
            END AS is_admin,
            users.fk_role AS user_role_admin,
            roles_admin.name AS user_role_admin_name,
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
        LEFT JOIN
            localized_organizations AS organizations ON users.fk_organization = organizations.organization_id
        LEFT JOIN regions ON organizations.region_code = regions.code
        LEFT JOIN departements ON organizations.departement_code = departements.code
        LEFT JOIN epci ON organizations.epci_code = epci.code
        LEFT JOIN cities ON organizations.city_code = cities.code
        LEFT JOIN
            organization_types ON organizations.fk_type = organization_types.organization_type_id
        LEFT JOIN
            organization_categories ON organization_types.fk_category = organization_categories.uid
        LEFT JOIN
            roles_regular ON users.fk_role_regular = roles_regular.role_id
        LEFT JOIN
            user_options ON user_options.fk_user = users.user_id
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
            transaction,
        },
    );

    if (users.length === 0) {
        return [];
    }

    const userAccesses = await sequelize.query(
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
            type: sequelize.QueryTypes.SELECT,
            replacements: {
                userIds: users.map(({ id }) => id),
            },
            transaction,
        },
    );
    const hashedUserAccesses = userAccesses.reduce((argAcc, row) => {
        const acc = { ...argAcc };
        if (acc[row.fk_user] === undefined) {
            acc[row.fk_user] = [];
        }

        acc[row.fk_user].push(row);
        return acc;
    }, {});

    let permissionMap = null;
    if (filters.extended === true) {
        permissionMap = await permissionModel.find(users.map(({ id }) => id));
    }

    return users.map(row => serializeUser(
        { ...row, user_accesses: hashedUserAccesses[row.id] || [] },
        latestCharte,
        filters,
        permissionMap,
    ));
};
