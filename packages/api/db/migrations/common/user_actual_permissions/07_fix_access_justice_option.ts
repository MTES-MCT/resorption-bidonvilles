module.exports = (queryInterface, transaction) => queryInterface.sequelize.query(
    `CREATE VIEW user_actual_permissions AS (
        SELECT
            t2.level,
            t2.permission_id,
            t2.option_id,
            t2.user_id,
            users.email,
            users.fk_organization AS organization_id,
            t2.fk_entity,
            t2.fk_feature,
            t2.is_writing,
            t2.allowed,
            t2.allow_all,
            t2.regions,
            t2.departements,
            t2.epci,
            t2.cities,
            t2.shantytowns,
            t2.plans
        FROM (
            SELECT
                level,
                permission_id,
                option_id,
                user_id,
                fk_entity,
                fk_feature,
                is_writing,
                allowed,
                allow_all,
                regions,
                departements,
                epci,
                cities,
                shantytowns,
                plans,
                RANK() OVER(
                    PARTITION BY t.user_id, t.fk_entity, t.fk_feature ORDER BY priority ASC
                ) AS "rank"
            FROM (
                SELECT
                    1 AS priority,
                    'user' AS level,
                    user_permissions.user_permission_id AS permission_id,
                    NULL AS option_id,
                    user_permissions.fk_user AS user_id,
                    user_permissions.fk_entity,
                    user_permissions.fk_feature,
                    features.is_writing,
                    user_permissions.allowed,
                    CASE
                        WHEN user_permissions.allowed IS NOT TRUE THEN NULL
                        WHEN local_writing_locations.regions IS NULL THEN TRUE
                        ELSE user_permissions.allow_all
                    END AS allow_all,
                    CASE
                        WHEN user_permissions.allowed IS NOT TRUE THEN NULL
                        WHEN user_permissions.allow_all IS TRUE THEN NULL
                        WHEN local_writing_locations.regions IS NULL THEN NULL
                        WHEN user_permissions.is_cumulative IS FALSE THEN attachment_locations.regions
                        WHEN features.is_writing IS TRUE THEN local_writing_locations.regions || attachment_locations.regions
                        ELSE local_reading_locations.regions || attachment_locations.regions
                    END AS regions,
                    CASE
                        WHEN user_permissions.allowed IS NOT TRUE THEN NULL
                        WHEN user_permissions.allow_all IS TRUE THEN NULL
                        WHEN local_writing_locations.departements IS NULL THEN NULL
                        WHEN user_permissions.is_cumulative IS FALSE THEN attachment_locations.departements
                        WHEN features.is_writing IS TRUE THEN local_writing_locations.departements || attachment_locations.departements
                        ELSE local_reading_locations.departements || attachment_locations.departements
                    END AS departements,
                    CASE
                        WHEN user_permissions.allowed IS NOT TRUE THEN NULL
                        WHEN user_permissions.allow_all IS TRUE THEN NULL
                        WHEN local_writing_locations.epci IS NULL THEN NULL
                        WHEN user_permissions.is_cumulative IS FALSE THEN attachment_locations.epci
                        WHEN features.is_writing IS TRUE THEN local_writing_locations.epci || attachment_locations.epci
                        ELSE local_reading_locations.epci || attachment_locations.epci
                    END AS epci,
                    CASE
                        WHEN user_permissions.allowed IS NOT TRUE THEN NULL
                        WHEN user_permissions.allow_all IS TRUE THEN NULL
                        WHEN local_writing_locations.cities IS NULL THEN NULL
                        WHEN user_permissions.is_cumulative IS FALSE THEN attachment_locations.cities
                        WHEN features.is_writing IS TRUE THEN local_writing_locations.cities || attachment_locations.cities
                        ELSE local_reading_locations.cities || attachment_locations.cities
                    END AS cities,
                    CASE
                        WHEN user_permissions.allowed IS NOT TRUE THEN NULL
                        WHEN user_permissions.allow_all IS TRUE THEN NULL
                        WHEN local_writing_locations.shantytowns IS NULL THEN NULL
                        WHEN user_permissions.is_cumulative IS FALSE THEN attachment_locations.shantytowns
                        WHEN features.is_writing IS TRUE THEN local_writing_locations.shantytowns || attachment_locations.shantytowns
                        ELSE local_reading_locations.shantytowns || attachment_locations.shantytowns
                    END AS shantytowns,
                    CASE
                        WHEN user_permissions.allowed IS NOT TRUE THEN NULL
                        WHEN user_permissions.allow_all IS TRUE THEN NULL
                        WHEN local_writing_locations.plans IS NULL THEN NULL
                        WHEN user_permissions.is_cumulative IS FALSE THEN attachment_locations.plans
                        WHEN features.is_writing IS TRUE THEN local_writing_locations.plans || attachment_locations.plans
                        ELSE local_reading_locations.plans || attachment_locations.plans
                    END AS plans
                FROM user_permissions
                LEFT JOIN users ON user_permissions.fk_user = users.user_id
                LEFT JOIN attachment_locations ON attachment_locations.fk_user_permission = user_permissions.user_permission_id
                LEFT JOIN features ON user_permissions.fk_feature = features.name AND user_permissions.fk_entity = features.fk_entity
                LEFT JOIN local_writing_locations ON local_writing_locations.user_id = user_permissions.fk_user
                LEFT JOIN local_reading_locations ON local_reading_locations.user_id = user_permissions.fk_user
                WHERE user_permissions.fk_user IS NOT NULL AND users.fk_role IS NULL

                UNION

                SELECT
                    2 AS priority,
                    'option' AS level,
                    NULL AS permission_id,
                    options.option_id,
                    options.user_id,
                    options.fk_entity,
                    options.fk_feature,
                    options.is_writing,
                    options.allowed,
                    options.allow_all,
                    options.regions,
                    options.departements,
                    options.epci,
                    options.cities,
                    options.shantytowns,
                    options.plans
                FROM (
                    SELECT
                        user_permission_options.fk_option AS option_id,
                        user_permission_options.fk_user AS user_id,
                        'shantytown' AS fk_entity,
                        'close' AS fk_feature,
                        TRUE AS is_writing,
                        TRUE AS allowed,
                        CASE
                            WHEN local_writing_locations.regions IS NULL THEN TRUE
                            ELSE FALSE
                        END AS allow_all,
                        CASE
                            WHEN local_writing_locations.regions IS NULL THEN NULL
                            ELSE local_writing_locations.regions
                        END AS regions,
                        CASE
                            WHEN local_writing_locations.departements IS NULL THEN NULL
                            ELSE local_writing_locations.departements
                        END AS departements,
                        CASE
                            WHEN local_writing_locations.epci IS NULL THEN NULL
                            ELSE local_writing_locations.epci
                        END AS epci,
                        CASE
                            WHEN local_writing_locations.cities IS NULL THEN NULL
                            ELSE local_writing_locations.cities
                        END AS cities,
                        CASE
                            WHEN local_writing_locations.shantytowns IS NULL THEN NULL
                            ELSE local_writing_locations.shantytowns
                        END AS shantytowns,
                        CASE
                            WHEN local_writing_locations.plans IS NULL THEN NULL
                            ELSE local_writing_locations.plans
                        END AS plans
                    FROM user_permission_options
                    LEFT JOIN local_writing_locations ON user_permission_options.fk_user = local_writing_locations.user_id
                    WHERE fk_option IN ('close_shantytown', 'create_and_close_shantytown')

                    UNION

                    SELECT
                        user_permission_options.fk_option AS option_id,
                        user_permission_options.fk_user AS user_id,
                        'shantytown' AS fk_entity,
                        'create' AS fk_feature,
                        TRUE AS is_writing,
                        TRUE AS allowed,
                        CASE
                            WHEN local_writing_locations.regions IS NULL THEN TRUE
                            ELSE FALSE
                        END AS allow_all,
                        CASE
                            WHEN local_writing_locations.regions IS NULL THEN NULL
                            ELSE local_writing_locations.regions
                        END AS regions,
                        CASE
                            WHEN local_writing_locations.departements IS NULL THEN NULL
                            ELSE local_writing_locations.departements
                        END AS departements,
                        CASE
                            WHEN local_writing_locations.epci IS NULL THEN NULL
                            ELSE local_writing_locations.epci
                        END AS epci,
                        CASE
                            WHEN local_writing_locations.cities IS NULL THEN NULL
                            ELSE local_writing_locations.cities
                        END AS cities,
                        CASE
                            WHEN local_writing_locations.shantytowns IS NULL THEN NULL
                            ELSE local_writing_locations.shantytowns
                        END AS shantytowns,
                        CASE
                            WHEN local_writing_locations.plans IS NULL THEN NULL
                            ELSE local_writing_locations.plans
                        END AS plans
                    FROM user_permission_options
                    LEFT JOIN local_writing_locations ON user_permission_options.fk_user = local_writing_locations.user_id
                    WHERE fk_option IN ('create_and_close_shantytown')

                    UNION

                    SELECT
                        user_permission_options.fk_option AS option_id,
                        user_permission_options.fk_user AS user_id,
                        'shantytown_justice' AS fk_entity,
                        'access' AS fk_feature,
                        FALSE AS is_writing,
                        TRUE AS allowed,
                        FALSE AS allow_all,
                        NULL AS regions,
                        NULL AS departements,
                        NULL AS epci,
                        NULL AS cities,
                        NULL AS shantytowns,
                        NULL AS plans
                    FROM user_permission_options
                    WHERE fk_option IN ('access_justice')
                ) options
                LEFT JOIN users ON options.user_id = users.user_id
                WHERE users.fk_role IS NULL

                UNION

                SELECT
                    3 AS priority,
                    'organization' AS level,
                    user_permissions.user_permission_id AS permission_id,
                    NULL AS option_id,
                    users.user_id,
                    user_permissions.fk_entity,
                    user_permissions.fk_feature,
                    features.is_writing,
                    user_permissions.allowed,
                    CASE
                        WHEN user_permissions.allowed IS NOT TRUE THEN NULL
                        WHEN local_writing_locations.regions IS NULL THEN TRUE
                        ELSE user_permissions.allow_all
                    END AS allow_all,
                    CASE
                        WHEN user_permissions.allowed IS NOT TRUE THEN NULL
                        WHEN user_permissions.allow_all IS TRUE THEN NULL
                        WHEN local_writing_locations.regions IS NULL THEN NULL
                        WHEN user_permissions.is_cumulative IS FALSE THEN attachment_locations.regions
                        WHEN features.is_writing IS TRUE THEN local_writing_locations.regions || attachment_locations.regions
                        ELSE local_reading_locations.regions || attachment_locations.regions
                    END AS regions,
                    CASE
                        WHEN user_permissions.allowed IS NOT TRUE THEN NULL
                        WHEN user_permissions.allow_all IS TRUE THEN NULL
                        WHEN local_writing_locations.departements IS NULL THEN NULL
                        WHEN user_permissions.is_cumulative IS FALSE THEN attachment_locations.departements
                        WHEN features.is_writing IS TRUE THEN local_writing_locations.departements || attachment_locations.departements
                        ELSE local_reading_locations.departements || attachment_locations.departements
                    END AS departements,
                    CASE
                        WHEN user_permissions.allowed IS NOT TRUE THEN NULL
                        WHEN user_permissions.allow_all IS TRUE THEN NULL
                        WHEN local_writing_locations.epci IS NULL THEN NULL
                        WHEN user_permissions.is_cumulative IS FALSE THEN attachment_locations.epci
                        WHEN features.is_writing IS TRUE THEN local_writing_locations.epci || attachment_locations.epci
                        ELSE local_reading_locations.epci || attachment_locations.epci
                    END AS epci,
                    CASE
                        WHEN user_permissions.allowed IS NOT TRUE THEN NULL
                        WHEN user_permissions.allow_all IS TRUE THEN NULL
                        WHEN local_writing_locations.cities IS NULL THEN NULL
                        WHEN user_permissions.is_cumulative IS FALSE THEN attachment_locations.cities
                        WHEN features.is_writing IS TRUE THEN local_writing_locations.cities || attachment_locations.cities
                        ELSE local_reading_locations.cities || attachment_locations.cities
                    END AS cities,
                    CASE
                        WHEN user_permissions.allowed IS NOT TRUE THEN NULL
                        WHEN user_permissions.allow_all IS TRUE THEN NULL
                        WHEN local_writing_locations.shantytowns IS NULL THEN NULL
                        WHEN user_permissions.is_cumulative IS FALSE THEN attachment_locations.shantytowns
                        WHEN features.is_writing IS TRUE THEN local_writing_locations.shantytowns || attachment_locations.shantytowns
                        ELSE local_reading_locations.shantytowns || attachment_locations.shantytowns
                    END AS shantytowns,
                    CASE
                        WHEN user_permissions.allowed IS NOT TRUE THEN NULL
                        WHEN user_permissions.allow_all IS TRUE THEN NULL
                        WHEN local_writing_locations.plans IS NULL THEN NULL
                        WHEN user_permissions.is_cumulative IS FALSE THEN attachment_locations.plans
                        WHEN features.is_writing IS TRUE THEN local_writing_locations.plans || attachment_locations.plans
                        ELSE local_reading_locations.plans || attachment_locations.plans
                    END AS plans
                FROM user_permissions
                LEFT JOIN users ON users.fk_organization = user_permissions.fk_organization
                LEFT JOIN attachment_locations ON attachment_locations.fk_user_permission = user_permissions.user_permission_id
                LEFT JOIN features ON user_permissions.fk_feature = features.name AND user_permissions.fk_entity = features.fk_entity
                LEFT JOIN local_writing_locations ON local_writing_locations.user_id = users.user_id
                LEFT JOIN local_reading_locations ON local_reading_locations.user_id = users.user_id
                WHERE user_permissions.fk_organization IS NOT NULL AND users.user_id IS NOT NULL AND users.fk_role IS NULL

                UNION

                SELECT
                    4 AS priority,
                    'role_regular' AS level,
                    role_permissions.role_permission_id AS permission_id,
                    NULL AS option_id,
                    users.user_id,
                    role_permissions.fk_entity,
                    role_permissions.fk_feature,
                    features.is_writing,
                    role_permissions.allowed,
                    CASE
                        WHEN role_permissions.allowed IS NOT TRUE THEN NULL
                        WHEN local_writing_locations.regions IS NULL THEN TRUE
                        ELSE role_permissions.allow_all
                    END AS allow_all,
                    CASE
                        WHEN role_permissions.allowed IS NOT TRUE THEN NULL
                        WHEN role_permissions.allow_all IS TRUE THEN NULL
                        WHEN local_writing_locations.regions IS NULL THEN NULL
                        WHEN features.is_writing IS TRUE THEN local_writing_locations.regions
                        ELSE local_reading_locations.regions
                    END AS regions,
                    CASE
                        WHEN role_permissions.allowed IS NOT TRUE THEN NULL
                        WHEN role_permissions.allow_all IS TRUE THEN NULL
                        WHEN local_writing_locations.departements IS NULL THEN NULL
                        WHEN features.is_writing IS TRUE THEN local_writing_locations.departements
                        ELSE local_reading_locations.departements
                    END AS departements,
                    CASE
                        WHEN role_permissions.allowed IS NOT TRUE THEN NULL
                        WHEN role_permissions.allow_all IS TRUE THEN NULL
                        WHEN local_writing_locations.epci IS NULL THEN NULL
                        WHEN features.is_writing IS TRUE THEN local_writing_locations.epci
                        ELSE local_reading_locations.epci
                    END AS epci,
                    CASE
                        WHEN role_permissions.allowed IS NOT TRUE THEN NULL
                        WHEN role_permissions.allow_all IS TRUE THEN NULL
                        WHEN local_writing_locations.cities IS NULL THEN NULL
                        WHEN features.is_writing IS TRUE THEN local_writing_locations.cities
                        ELSE local_reading_locations.cities
                    END AS cities,
                    CASE
                        WHEN role_permissions.allowed IS NOT TRUE THEN NULL
                        WHEN role_permissions.allow_all IS TRUE THEN NULL
                        WHEN local_writing_locations.shantytowns IS NULL THEN NULL
                        WHEN features.is_writing IS TRUE THEN local_writing_locations.shantytowns
                        ELSE local_reading_locations.shantytowns
                    END AS shantytowns,
                    CASE
                        WHEN role_permissions.allowed IS NOT TRUE THEN NULL
                        WHEN role_permissions.allow_all IS TRUE THEN NULL
                        WHEN local_writing_locations.plans IS NULL THEN NULL
                        WHEN features.is_writing IS TRUE THEN local_writing_locations.plans
                        ELSE local_reading_locations.plans
                    END AS plans
                FROM role_permissions
                LEFT JOIN users ON users.fk_role_regular = role_permissions.fk_role_regular
                LEFT JOIN features ON role_permissions.fk_feature = features.name AND role_permissions.fk_entity = features.fk_entity
                LEFT JOIN local_writing_locations ON local_writing_locations.user_id = users.user_id
                LEFT JOIN local_reading_locations ON local_reading_locations.user_id = users.user_id
                WHERE role_permissions.fk_role_regular IS NOT NULL AND users.user_id IS NOT NULL AND users.fk_role IS NULL

                UNION

                SELECT
                    5 AS priority,
                    'role_admin' AS level,
                    role_permissions.role_permission_id AS permission_id,
                    NULL AS option_id,
                    users.user_id,
                    role_permissions.fk_entity,
                    role_permissions.fk_feature,
                    features.is_writing,
                    role_permissions.allowed,
                    CASE
                        WHEN role_permissions.allowed IS NOT TRUE THEN NULL
                        WHEN local_writing_locations.regions IS NULL THEN TRUE
                        ELSE role_permissions.allow_all
                    END AS allow_all,
                    CASE
                        WHEN role_permissions.allowed IS NOT TRUE THEN NULL
                        WHEN role_permissions.allow_all IS TRUE THEN NULL
                        WHEN local_writing_locations.regions IS NULL THEN NULL
                        WHEN features.is_writing IS TRUE THEN local_writing_locations.regions
                        ELSE local_reading_locations.regions
                    END AS regions,
                    CASE
                        WHEN role_permissions.allowed IS NOT TRUE THEN NULL
                        WHEN role_permissions.allow_all IS TRUE THEN NULL
                        WHEN local_writing_locations.departements IS NULL THEN NULL
                        WHEN features.is_writing IS TRUE THEN local_writing_locations.departements
                        ELSE local_reading_locations.departements
                    END AS departements,
                    CASE
                        WHEN role_permissions.allowed IS NOT TRUE THEN NULL
                        WHEN role_permissions.allow_all IS TRUE THEN NULL
                        WHEN local_writing_locations.epci IS NULL THEN NULL
                        WHEN features.is_writing IS TRUE THEN local_writing_locations.epci
                        ELSE local_reading_locations.epci
                    END AS epci,
                    CASE
                        WHEN role_permissions.allowed IS NOT TRUE THEN NULL
                        WHEN role_permissions.allow_all IS TRUE THEN NULL
                        WHEN local_writing_locations.cities IS NULL THEN NULL
                        WHEN features.is_writing IS TRUE THEN local_writing_locations.cities
                        ELSE local_reading_locations.cities
                    END AS cities,
                    CASE
                        WHEN role_permissions.allowed IS NOT TRUE THEN NULL
                        WHEN role_permissions.allow_all IS TRUE THEN NULL
                        WHEN local_writing_locations.shantytowns IS NULL THEN NULL
                        WHEN features.is_writing IS TRUE THEN local_writing_locations.shantytowns
                        ELSE local_reading_locations.shantytowns
                    END AS shantytowns,
                    CASE
                        WHEN role_permissions.allowed IS NOT TRUE THEN NULL
                        WHEN role_permissions.allow_all IS TRUE THEN NULL
                        WHEN local_writing_locations.plans IS NULL THEN NULL
                        WHEN features.is_writing IS TRUE THEN local_writing_locations.plans
                        ELSE local_reading_locations.plans
                    END AS plans
                FROM role_permissions
                LEFT JOIN users ON users.fk_role = role_permissions.fk_role_admin
                LEFT JOIN features ON role_permissions.fk_feature = features.name AND role_permissions.fk_entity = features.fk_entity
                LEFT JOIN local_writing_locations ON local_writing_locations.user_id = users.user_id
                LEFT JOIN local_reading_locations ON local_reading_locations.user_id = users.user_id
                WHERE role_permissions.fk_role_admin IS NOT NULL AND users.user_id IS NOT NULL
            ) t
        ) t2
        LEFT JOIN users ON t2.user_id = users.user_id
        WHERE t2."rank" = 1
        ORDER BY t2.user_id ASC, t2.fk_entity ASC, t2.fk_feature ASC
    )`,
    {
        transaction,
    },
);
