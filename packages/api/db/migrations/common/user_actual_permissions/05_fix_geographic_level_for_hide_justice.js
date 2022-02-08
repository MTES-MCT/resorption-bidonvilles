module.exports = (queryInterface, transaction) => queryInterface.sequelize.query(
    `CREATE VIEW user_actual_permissions AS
        (WITH summary AS
            (
            SELECT
                ROW_NUMBER() OVER(
                    PARTITION BY t.user_id, t.fk_entity, t.fk_feature ORDER BY t.permission_priority ASC
                ) AS "rank",
                t.*
            FROM
                (
                    (SELECT
                        1 AS permission_priority,
                        u.user_id,
                        u.email,
                        p.permission_id,
                        p.fk_user,
                        p.fk_role_admin,
                        p.fk_role_regular,
                        p.fk_feature,
                        p.fk_entity,
                        p.allowed,
                        p.fk_geographic_level
                    FROM users u
                    LEFT JOIN roles_admin ra ON u.fk_role = ra.role_id
                    LEFT JOIN permissions p ON p.fk_role_admin = ra.role_id)

                    UNION

                    (SELECT
                        2 AS permission_priority,
                        u.user_id,
                        u.email,
                        p.permission_id,
                        p.fk_user,
                        p.fk_role_admin,
                        p.fk_role_regular,
                        p.fk_feature,
                        p.fk_entity,
                        p.allowed,
                        p.fk_geographic_level
                    FROM users u
                    LEFT JOIN permissions p ON p.fk_user = u.user_id
                    WHERE u.fk_role IS NULL)

                    UNION

                    (SELECT
                        3 AS permission_priority,
                        t2.user_id,
                        u.email,
                        NULL AS permission_id,
                        NULL AS fk_user,
                        NULL AS fk_role_admin,
                        NULL AS fk_role_regular,
                        t2.fk_feature,
                        t2.fk_entity,
                        t2.allowed,
                        t2.fk_geographic_level
                    FROM (
                        (SELECT
                            fk_user AS user_id,
                            'create' AS fk_feature,
                            'shantytown' AS fk_entity,
                            TRUE AS allowed,
                            'local' AS fk_geographic_level
                        FROM user_permission_options
                        WHERE fk_option IN('create_and_close_shantytown'))

                        UNION

                        (SELECT
                            fk_user AS user_id,
                            'close' AS fk_feature,
                            'shantytown' AS fk_entity,
                            TRUE AS allowed,
                            'local' AS fk_geographic_level
                        FROM user_permission_options
                        WHERE fk_option IN('create_and_close_shantytown', 'close_shantytown'))

                        UNION

                        (SELECT
                            fk_user AS user_id,
                            'access' AS fk_feature,
                            'shantytown_justice' AS fk_entity,
                            FALSE AS allowed,
                            NULL AS fk_geographic_level
                        FROM user_permission_options
                        WHERE fk_option IN('hide_justice'))
                    ) t2
                    LEFT JOIN users u ON t2.user_id = u.user_id)

                    UNION

                    (SELECT
                        4 AS permission_priority,
                        u.user_id,
                        u.email,
                        p.permission_id,
                        p.fk_user,
                        p.fk_role_admin,
                        p.fk_role_regular,
                        p.fk_feature,
                        p.fk_entity,
                        p.allowed,
                        p.fk_geographic_level
                    FROM users u
                    LEFT JOIN permissions p ON p.fk_role_regular = u.fk_role_regular
                    WHERE u.fk_role IS NULL)
                ) t
            )
            SELECT
                summary.*,
                features.is_writing
            FROM summary
            LEFT JOIN features ON summary.fk_feature = features.name AND summary.fk_entity = features.fk_entity
            WHERE "rank" = 1 AND summary.fk_feature IS NOT NULL
        )`,
    {
        transaction,
    },
);
