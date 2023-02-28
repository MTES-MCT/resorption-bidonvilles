module.exports = `
CREATE VIEW full_role_permissions AS (
    SELECT
        role_permissions.role_permission_id AS permission_id,
        roles_admin.role_id AS role,
        features.name AS feature,
        features.fk_entity AS entity,
        features.is_writing,
        COALESCE(role_permissions.allowed, FALSE) AS allowed,
        role_permissions.allow_all
    FROM features
    LEFT JOIN roles_admin ON TRUE
    LEFT JOIN role_permissions ON role_permissions.fk_feature = features.name
        AND role_permissions.fk_entity = features.fk_entity
        AND role_permissions.fk_role_admin = roles_admin.role_id

    UNION

    SELECT
        role_permissions.role_permission_id AS permission_id,
        roles_regular.role_id AS role,
        features.name AS feature,
        features.fk_entity AS entity,
        features.is_writing,
        COALESCE(role_permissions.allowed, FALSE) AS allowed,
        role_permissions.allow_all
    FROM features
    LEFT JOIN roles_regular ON TRUE
    LEFT JOIN role_permissions ON role_permissions.fk_feature = features.name
        AND role_permissions.fk_entity = features.fk_entity
        AND role_permissions.fk_role_regular = roles_regular.role_id
)`;
