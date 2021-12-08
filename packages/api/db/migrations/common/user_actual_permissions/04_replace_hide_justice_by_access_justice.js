module.exports = (queryInterface, transaction) => queryInterface.sequelize.query(
    `CREATE OR REPLACE VIEW user_actual_permissions AS
        (WITH summary AS
            (
            SELECT row_number() OVER (PARTITION BY t.user_id, t.fk_entity, t.fk_feature ORDER BY t.permission_priority) AS rank,
                t.permission_priority,
                t.user_id,
                t.email,
                t.permission_id,
                t.fk_user,
                t.fk_role_admin,
                t.fk_role_regular,
                t.fk_feature,
                t.fk_entity,
                t.allowed,
                t.fk_geographic_level
               FROM ( SELECT 1 AS permission_priority,
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
                         LEFT JOIN roles_admin ra ON u.fk_role::text = ra.role_id::text
                         LEFT JOIN permissions p ON p.fk_role_admin::text = ra.role_id::text
                    UNION
                     SELECT 2 AS permission_priority,
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
                      WHERE u.fk_role IS NULL
                    UNION
                     SELECT 3 AS permission_priority,
                        t2.user_id,
                        u.email,
                        NULL::integer AS permission_id,
                        NULL::integer AS fk_user,
                        NULL::character varying AS fk_role_admin,
                        NULL::character varying AS fk_role_regular,
                        t2.fk_feature,
                        t2.fk_entity,
                        t2.allowed,
                        t2.fk_geographic_level
                       FROM ( SELECT user_permission_options.fk_user AS user_id,
                                'create'::text AS fk_feature,
                                'shantytown'::text AS fk_entity,
                                true AS allowed,
                                'local'::text AS fk_geographic_level
                               FROM user_permission_options
                              WHERE user_permission_options.fk_option::text = 'create_and_close_shantytown'::text
                            UNION
                             SELECT user_permission_options.fk_user AS user_id,
                                'close'::text AS fk_feature,
                                'shantytown'::text AS fk_entity,
                                true AS allowed,
                                'local'::text AS fk_geographic_level
                               FROM user_permission_options
                              WHERE user_permission_options.fk_option::text = ANY (ARRAY['create_and_close_shantytown'::character varying::text, 'close_shantytown'::character varying::text])
                            UNION
                             SELECT user_permission_options.fk_user AS user_id,
                                'access'::text AS fk_feature,
                                'shantytown_justice'::text AS fk_entity,
                                true AS allowed,
                                'local'::text AS fk_geographic_level
                               FROM user_permission_options
                              WHERE user_permission_options.fk_option::text = 'access_justice'::text) t2
                         LEFT JOIN users u ON t2.user_id = u.user_id
                    UNION
                     SELECT 4 AS permission_priority,
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
                         LEFT JOIN permissions p ON p.fk_role_regular::text = u.fk_role_regular::text
                      WHERE u.fk_role IS NULL) t
            )
     SELECT summary.rank,
        summary.permission_priority,
        summary.user_id,
        summary.email,
        summary.permission_id,
        summary.fk_user,
        summary.fk_role_admin,
        summary.fk_role_regular,
        summary.fk_feature,
        summary.fk_entity,
        summary.allowed,
        summary.fk_geographic_level
       FROM summary
      WHERE summary.rank = 1 AND summary.fk_feature IS NOT NULL)`,
    {
        transaction,
    },
);
