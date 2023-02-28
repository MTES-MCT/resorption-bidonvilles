module.exports = `
CREATE OR REPLACE VIEW full_user_permissions_by_organization AS SELECT
    CASE
        WHEN   user_permissions.fk_organization IS NULL
            OR (
                user_permissions.allowed
                AND
                full_user_permissions_by_role.allowed
                AND
                full_user_permissions_by_role.regions IS NULL
            )
            THEN 'role'
        ELSE 'organization'
    END AS level,
    CASE
        WHEN   user_permissions.fk_organization IS NULL
            OR (
                user_permissions.allowed
                AND
                full_user_permissions_by_role.allowed
                AND
                full_user_permissions_by_role.regions IS NULL
            )
            THEN full_user_permissions_by_role.permission_id
        ELSE user_permissions.user_permission_id
    END AS permission_id,
    full_user_permissions_by_role.role,
    users.fk_organization AS organization_id,
    full_user_permissions_by_role.user_id,
    full_user_permissions_by_role.feature,
    full_user_permissions_by_role.entity,
    full_user_permissions_by_role.is_writing,
    COALESCE(user_permissions.allowed, full_user_permissions_by_role.allowed) AS allowed,
    CASE
        WHEN user_permissions.user_permission_id IS NULL THEN full_user_permissions_by_role.regions
        WHEN user_permissions.allowed
            AND NOT user_permissions.allow_all
            AND (NOT full_user_permissions_by_role.allowed OR full_user_permissions_by_role.regions IS NOT NULL)
            THEN COALESCE(full_user_permissions_by_role.regions, array[]::varchar[]) || user_permissions.regions
        ELSE NULL
    END AS regions,
    CASE
        WHEN user_permissions.user_permission_id IS NULL THEN full_user_permissions_by_role.departements
        WHEN    user_permissions.allowed
            AND NOT user_permissions.allow_all
            AND (NOT full_user_permissions_by_role.allowed OR full_user_permissions_by_role.departements IS NOT NULL)
            THEN COALESCE(full_user_permissions_by_role.departements, array[]::varchar[]) || user_permissions.departements
        ELSE NULL
    END AS departements,
    CASE
        WHEN user_permissions.user_permission_id IS NULL THEN full_user_permissions_by_role.epci
        WHEN    user_permissions.allowed
            AND NOT user_permissions.allow_all
            AND (NOT full_user_permissions_by_role.allowed OR full_user_permissions_by_role.epci IS NOT NULL)
            THEN COALESCE(full_user_permissions_by_role.epci, array[]::varchar[]) || user_permissions.epci
        ELSE NULL
    END AS epci,
    CASE
        WHEN user_permissions.user_permission_id IS NULL THEN full_user_permissions_by_role.cities
        WHEN    user_permissions.allowed
            AND NOT user_permissions.allow_all
            AND (NOT full_user_permissions_by_role.allowed OR full_user_permissions_by_role.cities IS NOT NULL)
            THEN COALESCE(full_user_permissions_by_role.cities, array[]::varchar[]) || user_permissions.cities
        ELSE NULL
    END AS cities,
    CASE
        WHEN user_permissions.user_permission_id IS NULL THEN full_user_permissions_by_role.shantytowns
        WHEN    user_permissions.allowed
            AND NOT user_permissions.allow_all
            AND (NOT full_user_permissions_by_role.allowed OR full_user_permissions_by_role.shantytowns IS NOT NULL)
            THEN COALESCE(full_user_permissions_by_role.shantytowns, array[]::integer[]) || user_permissions.shantytowns
        ELSE NULL
    END AS shantytowns,
    CASE
        WHEN user_permissions.user_permission_id IS NULL THEN full_user_permissions_by_role.actions
        WHEN    user_permissions.allowed
            AND NOT user_permissions.allow_all
            AND (NOT full_user_permissions_by_role.allowed OR full_user_permissions_by_role.actions IS NOT NULL)
            THEN COALESCE(full_user_permissions_by_role.actions, array[]::integer[]) || user_permissions.actions
        ELSE NULL
    END AS actions
FROM full_user_permissions_by_role
LEFT JOIN users ON full_user_permissions_by_role.user_id = users.user_id
LEFT JOIN user_permissions_with_attachments AS user_permissions ON user_permissions.fk_organization = users.fk_organization
      AND user_permissions.fk_feature = full_user_permissions_by_role.feature
      AND user_permissions.fk_entity = full_user_permissions_by_role.entity`;
