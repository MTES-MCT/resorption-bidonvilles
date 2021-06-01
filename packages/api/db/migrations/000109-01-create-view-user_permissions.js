module.exports = {
    up: queryInterface => queryInterface.sequelize.query(
        `CREATE VIEW user_actual_permissions AS
            (WITH summary AS
                (
                SELECT
                    ROW_NUMBER() OVER(
                        PARTITION BY t.user_id, t.fk_entity, t.fk_feature ORDER BY t.permission_priority ASC
                    ) AS "rank",
                    t.*
                FROM
                    ((SELECT
                        1 AS permission_priority,
                        u.user_id,
                        u.email,
                        p.*
                    FROM users u
                    LEFT JOIN roles_admin ra ON u.fk_role = ra.role_id
                    LEFT JOIN permissions p ON p.fk_role_admin = ra.role_id)
                    UNION
                    (SELECT
                        2 AS permission_priority,
                        u.user_id,
                        u.email,
                        p.*
                    FROM users u
                    LEFT JOIN permissions p ON p.fk_organization = u.fk_organization)
                    UNION
                    (SELECT
                        3 AS permission_priority,
                        u.user_id,
                        u.email,
                        p.*
                    FROM users u
                    LEFT JOIN organizations o ON u.fk_organization = o.organization_id
                    LEFT JOIN organization_types ot ON o.fk_type = ot.organization_type_id
                    LEFT JOIN permissions p ON p.fk_role_regular = ot.fk_role)) t
                )
                SELECT * FROM summary WHERE "rank" = 1 AND summary.permission_id IS NOT NULL)`,
    ),
    down: queryInterface => queryInterface.sequelize.query(
        'DROP VIEW user_actual_permissions',
    ),
};
