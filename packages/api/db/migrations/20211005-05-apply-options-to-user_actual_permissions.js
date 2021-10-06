// ce fichier corrige la vue user_actual_permissions en changeant les éléments suivants:
// 1- avant, pour un utilisateur donné, cette vue retenait dans l'ordre les permissions (role_admin > organization > role_regular)
//    désormais, la vue ne retient que les permissions role_admin (s'il y en a un), ou alors les permissions (organization > role_regular)
//    (c'est fait via l'ajout de `WHERE u.fk_role IS NULL`)
// 2- prise en compte des options (user_permission_options)
const createViewActualPermissions = require('./common/create_view_user_actual_permissions');

module.exports = {

    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            'DROP VIEW user_actual_permissions',
            { transaction },
        )
            .then(() => queryInterface.sequelize.query(
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
                                    p.fk_organization,
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
                                    p.fk_organization,
                                    p.fk_role_admin,
                                    p.fk_role_regular,
                                    p.fk_feature,
                                    p.fk_entity,
                                    p.allowed,
                                    p.fk_geographic_level
                                FROM users u
                                LEFT JOIN permissions p ON p.fk_organization = u.fk_organization
                                WHERE u.fk_role IS NULL)

                                UNION

                                (SELECT
                                    3 AS permission_priority,
                                    t2.user_id,
                                    u.email,
                                    NULL AS permission_id,
                                    NULL AS fk_organization,
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
                                        'local' AS fk_geographic_level
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
                                    p.fk_organization,
                                    p.fk_role_admin,
                                    p.fk_role_regular,
                                    p.fk_feature,
                                    p.fk_entity,
                                    p.allowed,
                                    p.fk_geographic_level
                                FROM users u
                                LEFT JOIN organizations o ON u.fk_organization = o.organization_id
                                LEFT JOIN organization_types ot ON o.fk_type = ot.organization_type_id
                                LEFT JOIN permissions p ON p.fk_role_regular = ot.fk_role
                                WHERE u.fk_role IS NULL)
                            ) t
                        )
                        SELECT * FROM summary WHERE "rank" = 1 AND summary.fk_feature IS NOT NULL)`,
                {
                    transaction,
                },
            )),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            'DROP VIEW user_actual_permissions',
            { transaction },
        )
            .then(() => createViewActualPermissions(queryInterface, transaction)),
    ),

};
