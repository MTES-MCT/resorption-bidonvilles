module.exports = {
    up: queryInterface => queryInterface.sequelize.query(
        `WITH old_permissions AS (
            SELECT *
            FROM (
                (SELECT p.permission_id
                FROM user_permission_options upo
                LEFT JOIN users u ON u.user_id = upo.fk_user
                LEFT JOIN permissions p ON p.fk_organization = u.fk_organization
                WHERE upo.fk_option = 'create_and_close_shantytown' AND p.fk_feature IN('create', 'close') AND p.fk_entity = 'shantytown' AND p.allowed = TRUE)

                UNION

                (SELECT p.permission_id
                FROM user_permission_options upo
                LEFT JOIN users u ON u.user_id = upo.fk_user
                LEFT JOIN permissions p ON p.fk_organization = u.fk_organization
                WHERE upo.fk_option = 'close_shantytown' AND p.fk_feature IN('close') AND p.fk_entity = 'shantytown' AND p.allowed = TRUE)) t
            )
        
        DELETE FROM permissions WHERE permission_id IN (SELECT permission_id FROM old_permissions)`,
    ),

    down: queryInterface => queryInterface.sequelize.query(
        `INSERT INTO permissions(fk_organization, fk_feature, fk_entity, allowed, fk_geographic_level)
        SELECT *
        FROM (
            (SELECT
                u.fk_organization,
                'close' AS fk_feature,
                'shantytown' AS fk_entity,
                TRUE AS allowed,
                'local' AS fk_geographic_level
            FROM user_permission_options upo
            LEFT JOIN users u ON u.user_id = upo.fk_user
            WHERE upo.fk_option IN('create_and_close_shantytown', 'close_shantytown'))
            UNION
            (SELECT
                u.fk_organization,
                'create' AS fk_feature,
                'shantytown' AS fk_entity,
                TRUE AS allowed,
                'local' AS fk_geographic_level
            FROM user_permission_options upo
            LEFT JOIN users u ON u.user_id = upo.fk_user
            WHERE upo.fk_option = 'create_and_close_shantytown')
            UNION
            (SELECT
                u.fk_organization,
                'access' AS fk_feature,
                'shantytown_justice' AS fk_entity,
                FALSE AS allowed,
                NULL AS fk_geographic_level
            FROM user_permission_options upo
            LEFT JOIN users u ON u.user_id = upo.fk_user
            WHERE upo.fk_option = 'hide_justice')
        ) t`,
    ),

};
