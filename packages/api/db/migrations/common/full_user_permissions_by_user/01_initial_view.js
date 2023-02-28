module.exports = `
CREATE OR REPLACE VIEW full_user_permissions_by_user AS SELECT
    CASE
        WHEN   user_permissions.fk_user IS NULL
            OR (
                user_permissions.allowed
                AND
                full_user_permissions_by_organization.allowed
                AND
                full_user_permissions_by_organization.regions IS NULL
            )
            THEN full_user_permissions_by_organization.level
        ELSE 'user'
    END AS level,
    CASE
        WHEN   user_permissions.fk_user IS NULL
            OR (
                user_permissions.allowed
                AND
                full_user_permissions_by_organization.allowed
                AND
                full_user_permissions_by_organization.regions IS NULL
            )
            THEN full_user_permissions_by_organization.permission_id
        ELSE user_permissions.user_permission_id
    END AS permission_id,
    full_user_permissions_by_organization.role,
    full_user_permissions_by_organization.organization_id,
    full_user_permissions_by_organization.user_id,
    full_user_permissions_by_organization.feature,
    full_user_permissions_by_organization.entity,
    full_user_permissions_by_organization.is_writing,
    COALESCE(user_permissions.allowed, full_user_permissions_by_organization.allowed) AS allowed,
    CASE
        WHEN user_permissions.user_permission_id IS NULL THEN full_user_permissions_by_organization.regions
        WHEN    user_permissions.allowed
            AND NOT user_permissions.allow_all
            AND (NOT full_user_permissions_by_organization.allowed OR full_user_permissions_by_organization.regions IS NOT NULL)
            THEN COALESCE(full_user_permissions_by_organization.regions, array[]::varchar[]) || user_permissions.regions
        ELSE NULL
    END AS regions,
    CASE
        WHEN user_permissions.user_permission_id IS NULL THEN full_user_permissions_by_organization.departements
        WHEN    user_permissions.allowed
            AND NOT user_permissions.allow_all
            AND (NOT full_user_permissions_by_organization.allowed OR full_user_permissions_by_organization.departements IS NOT NULL)
            THEN COALESCE(full_user_permissions_by_organization.departements, array[]::varchar[]) || user_permissions.departements
        ELSE NULL
    END AS departements,
    CASE
        WHEN user_permissions.user_permission_id IS NULL THEN full_user_permissions_by_organization.epci
        WHEN    user_permissions.allowed
            AND NOT user_permissions.allow_all
            AND (NOT full_user_permissions_by_organization.allowed OR full_user_permissions_by_organization.epci IS NOT NULL)
            THEN COALESCE(full_user_permissions_by_organization.epci, array[]::varchar[]) || user_permissions.epci
        ELSE NULL
    END AS epci,
    CASE
        WHEN user_permissions.user_permission_id IS NULL THEN full_user_permissions_by_organization.cities
        WHEN    user_permissions.allowed
            AND NOT user_permissions.allow_all
            AND (NOT full_user_permissions_by_organization.allowed OR full_user_permissions_by_organization.cities IS NOT NULL)
            THEN COALESCE(full_user_permissions_by_organization.cities, array[]::varchar[]) || user_permissions.cities
        ELSE NULL
    END AS cities,
    CASE
        WHEN user_permissions.user_permission_id IS NULL THEN full_user_permissions_by_organization.shantytowns
        WHEN    user_permissions.allowed
            AND NOT user_permissions.allow_all
            AND (NOT full_user_permissions_by_organization.allowed OR full_user_permissions_by_organization.shantytowns IS NOT NULL)
            THEN COALESCE(full_user_permissions_by_organization.shantytowns, array[]::integer[]) || user_permissions.shantytowns
        ELSE NULL
    END AS shantytowns,
    CASE
        WHEN user_permissions.user_permission_id IS NULL THEN full_user_permissions_by_organization.actions
        WHEN    user_permissions.allowed
            AND NOT user_permissions.allow_all
            AND (NOT full_user_permissions_by_organization.allowed OR full_user_permissions_by_organization.actions IS NOT NULL)
            THEN COALESCE(full_user_permissions_by_organization.actions, array[]::integer[]) || user_permissions.actions
        ELSE NULL
    END AS actions
FROM full_user_permissions_by_organization
LEFT JOIN users ON full_user_permissions_by_organization.user_id = users.user_id
LEFT JOIN user_permissions_with_attachments AS user_permissions ON user_permissions.fk_user = users.user_id
      AND user_permissions.fk_feature = full_user_permissions_by_organization.feature
      AND user_permissions.fk_entity = full_user_permissions_by_organization.entity`;
