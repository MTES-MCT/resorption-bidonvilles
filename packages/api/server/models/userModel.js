const permissionsDescription = require('#server/permissions_description');
const { getPermissionsFor } = require('#server/utils/permission');
const { mailBlacklist } = require('#server/config');
const { sequelize: database } = require('#db/models');

/**
 * @typedef {Object} UserFilters
 * @property {Boolean} [extended=false] Whether extended data should be returned or not
 * @property {Boolean} [auth=false]     Whether auth data should be returned or not
 * @property {Boolean} [app=false]      Whether app version data should be returned or not
 *
 * Please find below the details about each filter:
 * - extended data is any data useful for the logged in user only. Typically, data that you
 *   would not need to display a user's profile page (example: default_export)
 * - auth data is any private authentication material: password, salt...
 */


/**
 * Serializes a single user row
 *
 * @param {Object}             user
 * @param {Number|null}        latestCharte
 * @param {UserFilters}        filters
 * @param {PermissionMap|Null} permissionMap Map should be null only if the filter "extended" is not TRUE
 *
 * @returns {Object}
 */
function serializeUser(user, latestCharte, filters, permissionMap) {
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
                } : null,
            },
        },
        charte_engagement_a_jour: latestCharte === null || user.charte_engagement_signee === latestCharte,
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
            default_export: user.default_export ? user.default_export.split(',') : [],
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
}

module.exports = () => {
    // eslint-disable-next-line global-require
    const permissionModel = require('./permissionModel')(database);
    // eslint-disable-next-line global-require
    const charteEngagementModel = require('./charteEngagementModel')(database);

    /**
     * Fetches a list of users from the database
     *
     * @param {Array.<Object>} where   List of where clauses
     * @param {UserFilters}    filters
     * @param {User}           [user]    The user's permissions are used for filtering the results of the query
     * @param {String}         [feature] Permissions to be checked (necessary only if a user is provided)
     *
     * @returns {Array.<Object>}
     */
    async function query(where = [], filters, user = null, feature) {
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

        const users = await database.query(
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
                users.default_export,
                users.created_at,
                users.last_version,
                users.last_changelog,
                users.charte_engagement_signee,
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
                type: database.QueryTypes.SELECT,
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
    }

    function getNationalAdmins() {
        return query([
            {
                fk_role: ['national_admin'],
            },
            {
                fk_status: ['active'],
            },
            {
                organization_active: {
                    query: 'organizations.active',
                    value: [true],
                },
            },
        ], {});
    }

    function getLocalAdminsForRegion(regionCode) {
        return query([
            {
                fk_role: ['local_admin'],
            },
            {
                region: {
                    query: 'organizations.region_code',
                    value: [regionCode],
                },
            },
            {
                fk_status: ['active'],
            },
            {
                organization_active: {
                    query: 'organizations.active',
                    value: [true],
                },
            },
        ], {});
    }

    function getLocalAdminsForDepartement(departementCode) {
        return query([
            {
                fk_role: ['local_admin'],
            },
            {
                departement: {
                    query: 'organizations.departement_code',
                    value: [departementCode],
                },
            },
            {
                fk_status: ['active'],
            },
            {
                organization_active: {
                    query: 'organizations.active',
                    value: [true],
                },
            },
        ], {});
    }

    const model = {
        /**
         * Returns ALL users
         *
         * @param {User} user Used for filtering the returned list based on permissions
         *
         * @returns {Array.<User>}
         */
        findAll: user => query([], { auth: false, extended: false }, user, 'list'),

        /**
         * Returns a specific set of users
         *
         * @param {Array.<Number>} userIds
         *
         * @returns {Array.<User>}
         */
        findByIds: (user, userIds) => query(
            [
                {
                    user_id: userIds,
                },
            ],
            { auth: false, extended: false },
            user,
            'list',
        ),

        /**
         * Searches for a single user by user_id
         *
         * @param {Number}      userId
         * @param {UserFilters} [filters]
         * @param {User}        [user]    If the permissions should be checked
         * @param {String}      [feature='read']
         *
         * @returns {User}
         */
        findOne: async (userId, filters = {}, user = null, feature = 'read') => {
            const users = await query(
                [{ user_id: [userId] }],
                filters,
                user,
                feature,
            );

            return users.length === 1 ? users[0] : null;
        },

        /**
         * Searches for a single user by email
         *
         * @param {String}      email
         * @param {UserFilters} [filters]
         *
         * @returns {User}
         */
        findOneByEmail: async (email, filters = {}) => {
            const users = await query(
                [{ email: { value: [email.toUpperCase()], query: 'upper(users.email)' } }],
                filters,
            );

            return users.length === 1 ? users[0] : null;
        },

        /**
         * Searches for a single user by access id
         *
         * @param {Number}      userAccessId
         * @param {UserFilters} [filters]
         *
         * @returns {User}
         */
        findOneByAccessId: async (userAccessId, filters = {}) => {
            const users = await query(
                [
                    {
                        userAccessId: {
                            query: 'last_user_accesses.user_access_id',
                            value: [userAccessId],
                        },
                    },
                ],
                filters,
            );

            return users.length === 1 ? users[0] : null;
        },

        /**
         * Searches for the users members of an organization
         *
         * @param {Number}       organizationId
         * @param {UseerFilters} [filters]
         *
         * @returns {Array.<User>}
         */
        findByOrganization: (organizationId, filters = {}) => query(
            [
                {
                    organization: {
                        query: 'organizations.organization_id',
                        value: [organizationId],
                    },
                },
            ],
            filters,
        ),

        findByOrganizationCategory: (organizationCategoryId, geographicFilter = undefined, filters = {}) => {
            const where = [
                {
                    organizationCategory: {
                        query: 'organization_categories.uid',
                        value: [organizationCategoryId],
                    },
                },
            ];

            if (geographicFilter !== undefined) {
                if (geographicFilter.type === 'departement') {
                    where.push({
                        departement: {
                            query: 'organizations.departement_code',
                            value: [geographicFilter.value],
                        },
                    });
                } else if (geographicFilter.type === 'region') {
                    where.push({
                        departement: {
                            query: 'organizations.region_code',
                            value: [geographicFilter.value],
                        },
                    });
                }
            }

            return query(where, filters);
        },

        update: async (userId, values, transaction = undefined) => {
            if (userId === undefined) {
                throw new Error('The user id is missing');
            }

            const allowedProperties = [
                'first_name', 'last_name', 'position', 'phone', 'password', 'defaultExport', 'fk_status',
                'last_version', 'last_changelog', 'charte_engagement_signee', 'last_access',
            ];
            const propertiesToColumns = {
                first_name: 'first_name',
                last_name: 'last_name',
                position: 'position',
                phone: 'phone',
                password: 'password',
                defaultExport: 'default_export',
                fk_status: 'fk_status',
                last_version: 'last_version',
                last_changelog: 'last_changelog',
                charte_engagement_signee: 'charte_engagement_signee',
                last_access: 'last_access',
            };
            const setClauses = [];
            const replacements = {};

            allowedProperties.forEach((property) => {
                if (values && values[property] !== undefined) {
                    setClauses.push(`${propertiesToColumns[property]} = :${property}`);

                    if (property === 'defaultExport' && values[property]) {
                        replacements[property] = values[property].replace(/\s/g, '') || null;
                    } else {
                        replacements[property] = values[property] || null;
                    }
                }
            });

            if (setClauses.length === 0) {
                throw new Error('The updated values are missing');
            }

            const [, { rowCount }] = await database.query(
                `UPDATE
                    users
                SET
                    ${setClauses.join(',')}
                WHERE
                    users.user_id = :userId`,
                {
                    replacements: Object.assign(replacements, {
                        userId,
                    }),
                    transaction,
                },
            );

            if (rowCount === 0) {
                throw new Error(`The user #${userId} does not exist`);
            }
        },

        delete: id => database.query(
            'DELETE FROM users WHERE users.user_id = :id',
            {
                replacements: {
                    id,
                },
            },
        ),

        deactivate: id => database.query(
            `UPDATE
                users
            SET
                fk_status = 'inactive'
            WHERE
                user_id = :id
            `,
            {
                replacements: {
                    id,
                },
            },
        ),

        getNationalAdmins,

        getDirectory: async () => {
            const users = await database.query(
                `
                SELECT
                    organizations.organization_id,
                    organizations.name,
                    organizations.abbreviation,
                    organizations.location_type,
                    organizations.region_code,
                    organizations.region_name,
                    organizations.departement_code,
                    organizations.departement_name,
                    organizations.epci_code,
                    organizations.epci_name,
                    organizations.city_code,
                    organizations.city_name,
                    roles_regular.name AS role,
                    users.user_id AS "user_id",
                    users.fk_role AS "user_role",
                    users.first_name AS "user_firstName",
                    users.last_name AS "user_lastName",
                    users.email AS "user_email",
                    users.phone AS "user_phone",
                    users.position AS "user_position",
                    organizations.fk_type AS "type_id",
                    organization_types.fk_category AS "type_category",
                    organization_types.name_singular AS "type_name",
                    organization_types.abbreviation AS "type_abbreviation"
                FROM localized_organizations AS organizations
                LEFT JOIN users ON users.fk_organization = organizations.organization_id
                LEFT JOIN organization_types ON organizations.fk_type = organization_types.organization_type_id
                LEFT JOIN roles_regular ON organization_types.fk_role = roles_regular.role_id
                WHERE
                    organizations.active = TRUE
                    AND
                    users.fk_status = 'active'
                ORDER BY organizations.name, users.last_name, users.first_name
                `,
                {
                    type: database.QueryTypes.SELECT,
                },
            );

            const hash = {};
            const organizations = [];
            users.forEach((user) => {
                if (!Object.prototype.hasOwnProperty.call(hash, user.organization_id)) {
                    hash[user.organization_id] = {
                        id: user.organization_id,
                        name: user.name,
                        abbreviation: user.abbreviation,
                        location: {
                            type: user.location_type,
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
                            } : null,
                        },
                        type: {
                            id: user.type_id,
                            category: user.type_category,
                            name: user.type_name,
                            abbreviation: user.type_abbreviation,
                        },
                        users: [],
                        role: user.role,
                    };
                    organizations.push(hash[user.organization_id]);
                }

                if (user.user_id !== null) {
                    hash[user.organization_id].users.push({
                        id: user.user_id,
                        role: user.user_role,
                        first_name: user.user_firstName,
                        last_name: user.user_lastName,
                        email: user.user_email,
                        phone: user.user_phone,
                        position: user.user_position,
                    });
                }
            });

            return organizations;
        },
    };

    model.create = async (user, transaction = undefined) => {
        const response = await database.query(
            `INSERT INTO
                users(
                    first_name,
                    last_name,
                    email,
                    fk_organization,
                    position,
                    access_request_message,
                    salt,
                    phone,
                    fk_status,
                    created_by
                )

                VALUES(
                    :first_name,
                    :last_name,
                    :email,
                    :organization,
                    :position,
                    :access_request_message,
                    :salt,
                    :phone,
                    'new',
                    :created_by
                )
                
                RETURNING user_id`,
            {
                replacements: user,
                transaction,
            },
        );

        return response[0][0].user_id;
    };

    model.upgradeLocalAdmin = async (userId) => {
        await database.query(
            'UPDATE USERS SET fk_role = \'local_admin\' where user_id = :userId',
            {
                replacements: {
                    userId,
                },
            },
        );
    };

    model.downgradeLocalAdmin = async (userId) => {
        await database.query(
            'UPDATE USERS SET fk_role = NULL where user_id = :userId',
            {
                replacements: {
                    userId,
                },
            },
        );
    };

    model.getAdminsFor = async (user) => {
        let localAdmins = null;
        if (user.organization.location.departement !== null) {
            // if the user is related to a specific departement, get the admins for that departement only
            localAdmins = await getLocalAdminsForDepartement(user.organization.location.departement.code);
        } else if (user.organization.location.region !== null) {
            // if the user is related to a specific region, get the admins of all departements belonging to that region
            localAdmins = await getLocalAdminsForRegion(user.organization.location.region.code);
        }

        // if no local admin was found, provide national admins
        if (localAdmins === null || localAdmins.length === 0) {
            return getNationalAdmins();
        }

        return localAdmins;
    };

    model.findForRegion = async (regionCode, name = undefined) => {
        const where = [
            {
                nationalUser: {
                    query: 'organizations.location_type',
                    value: 'nation',
                },
                // or
                userInTheProperRegion: {
                    query: 'organizations.region_code',
                    value: regionCode,
                },
            },
            {
                fk_status: ['active'],
            },
        ];
        if (name !== undefined) {
            where.push({
                firstName: {
                    query: 'users.first_name',
                    operator: 'ILIKE',
                    value: `${name}%`,
                },
                // or
                lastName: {
                    query: 'users.last_name',
                    operator: 'ILIKE',
                    value: `${name}%`,
                },
            });
        }

        return query(where, {});
    };

    model.getShantytownWatchers = async (shantytownId, includePrivate) => database.query(
        `
            SELECT
                u.email,
                u.first_name,
                u.last_name
            FROM shantytown_watchers sw
            LEFT JOIN users u ON sw.fk_user = u.user_id
            LEFT JOIN user_actual_permissions up ON sw.fk_user = up.user_id
            WHERE
                    sw.fk_shantytown = :shantytownId
                AND up.fk_feature = 'listPrivate'
                AND up.fk_entity = 'shantytown_comment'
                ${includePrivate === true ? 'AND up.allowed = true' : ''}
            `,
        {
            type: database.QueryTypes.SELECT,
            replacements: {
                shantytownId,
            },
        },
    );

    model.getDepartementWatchers = async (departementCode, applyBlacklist = false) => {
        const users = await database.query(
            `SELECT
                u.user_id,
                u.email,
                u.first_name,
                u.last_name
            FROM localized_organizations lo
            LEFT JOIN users u ON u.fk_organization = lo.organization_id
            WHERE
                (lo.location_type != 'region' AND lo.departement_code = :departementCode)
                AND u.fk_status = 'active'
                AND lo.active = TRUE`,
            {
                type: database.QueryTypes.SELECT,
                replacements: {
                    departementCode,
                },
            },
        );

        if (applyBlacklist === true) {
            return users.filter(({ user_id }) => !mailBlacklist.includes(user_id));
        }

        return users;
    };

    model.formatName = (user) => {
        let { firstName, lastName } = user;
        if (!firstName && user.first_name) {
            ({ first_name: firstName, last_name: lastName } = user);
        }

        return `${firstName.charAt(0).toUpperCase() + firstName.slice(1)} ${lastName.toUpperCase()}`;
    };

    model.getHistory = async () => {
        const activities = await database.query(
            `
                SELECT
                    lua.used_at AS "date",
                    users.first_name,
                    users.last_name,
                    organizations.organization_id
                FROM last_user_accesses lua
                LEFT JOIN users ON lua.fk_user = users.user_id
                LEFT JOIN localized_organizations organizations ON users.fk_organization = organizations.organization_id
                WHERE
                    lua.used_at IS NOT NULL
                ORDER BY lua.used_at DESC
                `,
            {
                type: database.QueryTypes.SELECT,
            },
        );

        return activities
            .map(activity => ({
                entity: 'user',
                action: 'creation',
                date: activity.date.getTime() / 1000,
                user: {
                    name: model.formatName(activity),
                    organization: activity.organization_id,
                },
            }));
    };

    model.listExport = async () => database.query(
        `SELECT
            TO_CHAR(u.created_at :: DATE, 'dd/mm/yyyy') AS "Date de la demande d'accès",
            email AS "Courriel",
            INITCAP(first_name) AS "Prénom",
            UPPER(last_name) AS "Nom de famille",
            u.position AS "Fonction de l'utilisateur",
            u.phone as "Téléphone",
            CASE
                WHEN fk_status = 'active' THEN 'Compte activé'
                WHEN lua.expires_at < NOW() THEN 'Lien d''activation expiré'
                ELSE 'Lien d''activation toujours valide'
            END AS "Statut",
            TO_CHAR(lua.used_at :: DATE, 'dd/mm/yyyy') AS "Date d'activation du compte",
            u.fk_role AS "Rôle de l'acteur",
            TO_CHAR(u.last_access :: DATE, 'dd/mm/yyyy hh:mm:ss') AS "Date et heure de dernière connexion",    
            u.fk_role AS "Rôle de l'acteur",
            o.name AS "Organisation",
            o.abbreviation AS "Organisation abbr",
            rr.name AS "Rôle de l'organisation",
            o.region_code AS "Code région",
            o.region_name AS "Région",
            o.departement_code AS "Code département",
            o.departement_name AS "Département"
        FROM
            users u
        LEFT JOIN
            last_user_accesses lua ON lua.fk_user = u.user_id
        LEFT JOIN
            localized_organizations o ON o.organization_id = u.fk_organization
        LEFT JOIN
           organization_types ot ON ot.organization_type_id = o.fk_type
        LEFT JOIN
           roles_regular rr ON rr.role_id = ot.fk_role
        WHERE
            lua.user_access_id IS NOT NULL 
        AND
           u.fk_status <> 'inactive'
        ORDER BY
            "Code région",
            "Code département",
            used_at ASC,
            expires_at DESC;`,
    );

    return model;
};
