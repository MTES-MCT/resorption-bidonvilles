module.exports = `
CREATE OR REPLACE VIEW user_actual_permissions AS
SELECT DISTINCT ON (fk_user, fk_feature, fk_entity, allowed, type, fk_region, fk_departement, fk_epci, fk_city)
    level,
    user_id AS fk_user,
    fk_feature,
    fk_entity,
    FIRST_VALUE(allowed) OVER(
        PARTITION BY user_id, fk_feature, fk_entity
        ORDER BY CASE level
            WHEN 'user' THEN 1
            WHEN 'option' THEN 2
            WHEN 'organization' THEN 3
            WHEN 'role' THEN 4
        END ASC
    ) AS allowed,
    type,
    fk_region,
    fk_departement,
    fk_epci,
    fk_city
FROM (
    -- permissions par rôle
    SELECT
        'role' AS level,
        users.user_id,
        COALESCE(admin_permissions.fk_feature, reg_permissions.fk_feature) AS fk_feature,
        COALESCE(admin_permissions.fk_entity, reg_permissions.fk_entity) AS fk_entity,
        COALESCE(admin_permissions.allowed, reg_permissions.allowed) AS allowed,
        CASE
            WHEN COALESCE(admin_permissions.allowed, reg_permissions.allowed) IS NULL THEN NULL
            WHEN COALESCE(admin_permissions.allow_all, reg_permissions.allow_all) IS TRUE THEN 'nation'
            WHEN features.is_writing IS TRUE THEN intervention_areas.type
            WHEN COALESCE(intervention_areas.fk_departement, epci_to_departement.fk_departement, cities.fk_departement) IS NULL THEN intervention_areas.type
            ELSE 'departement'
        END AS type,

        CASE
            WHEN COALESCE(admin_permissions.allowed, reg_permissions.allowed) IS NULL THEN NULL
            WHEN COALESCE(admin_permissions.allow_all, reg_permissions.allow_all) IS TRUE THEN NULL
            ELSE intervention_areas.fk_region
        END AS fk_region,

        CASE
            WHEN COALESCE(admin_permissions.allowed, reg_permissions.allowed) IS NULL THEN NULL
            WHEN COALESCE(admin_permissions.allow_all, reg_permissions.allow_all) IS TRUE THEN NULL
            ELSE COALESCE(intervention_areas.fk_departement, epci_to_departement.fk_departement, cities.fk_departement)
        END AS fk_departement,

        CASE
            WHEN COALESCE(admin_permissions.allowed, reg_permissions.allowed) IS NULL THEN NULL
            WHEN COALESCE(admin_permissions.allow_all, reg_permissions.allow_all) IS TRUE THEN NULL
            ELSE intervention_areas.fk_epci
        END AS fk_epci,

        CASE
            WHEN COALESCE(admin_permissions.allowed, reg_permissions.allowed) IS NULL THEN NULL
            WHEN COALESCE(admin_permissions.allow_all, reg_permissions.allow_all) IS TRUE THEN NULL
            ELSE intervention_areas.fk_city
        END AS fk_city
    FROM users
    LEFT JOIN role_permissions AS reg_permissions ON users.fk_role IS NULL AND users.fk_role_regular = reg_permissions.fk_role_regular
    LEFT JOIN role_permissions AS admin_permissions ON users.fk_role = admin_permissions.fk_role_admin
    LEFT JOIN features ON features.name = COALESCE(admin_permissions.fk_feature, reg_permissions.fk_feature) AND features.fk_entity = COALESCE(admin_permissions.fk_entity, reg_permissions.fk_entity)
    LEFT JOIN intervention_areas ON intervention_areas.fk_user = users.user_id OR (users.use_custom_intervention_area IS FALSE AND intervention_areas.fk_organization = users.fk_organization)
    LEFT JOIN cities ON intervention_areas.fk_city = cities.code AND features.is_writing IS FALSE
    LEFT JOIN epci_to_departement ON intervention_areas.fk_epci = epci_to_departement.fk_epci AND features.is_writing IS FALSE

    UNION

    -- permissions par structure
    SELECT
        'organization' AS level,
        users.user_id,
        permissions.fk_feature,
        permissions.fk_entity,
        permissions.allowed,
        permissions.type::text::enum_intervention_areas_type,
        permissions.fk_region,
        permissions.fk_departement,
        permissions.fk_epci,
        permissions.fk_city
    FROM permissions
    LEFT JOIN users ON permissions.fk_organization = users.fk_organization AND users.use_custom_intervention_area IS FALSE
    WHERE permissions.fk_organization IS NOT NULL

    UNION

    -- permissions par option
    SELECT
        'option' AS level,
        user_permission_options.fk_user AS user_id,
        CASE user_permission_options.fk_option
            WHEN 'access_justice' THEN 'access'
            WHEN 'close_shantytown' THEN 'close'
            WHEN 'create_shantytown' THEN 'create'
        END AS fk_feature,

        CASE user_permission_options.fk_option
            WHEN 'access_justice' THEN 'shantytown_justice'
            WHEN 'close_shantytown' THEN 'shantytown'
            WHEN 'create_shantytown' THEN 'shantytown'
        END AS fk_entity,

        TRUE AS allowed,

        CASE
            WHEN user_permission_options.fk_option = 'access_justice' AND intervention_areas.type IN ('city', 'epci') THEN 'departement'
            ELSE intervention_areas.type
        END AS type,

        intervention_areas.fk_region,
        COALESCE(intervention_areas.fk_departement, epci_to_departement.fk_departement, cities.fk_departement) AS fk_departement,
        intervention_areas.fk_epci,
        intervention_areas.fk_city
    FROM user_permission_options
    LEFT JOIN users ON user_permission_options.fk_user = users.user_id
    LEFT JOIN intervention_areas ON intervention_areas.fk_user = users.user_id OR (users.use_custom_intervention_area IS FALSE AND intervention_areas.fk_organization = users.fk_organization)
    LEFT JOIN cities ON intervention_areas.fk_city = cities.code AND user_permission_options.fk_option = 'access_justice'
    LEFT JOIN epci_to_departement ON intervention_areas.fk_epci = epci_to_departement.fk_epci AND user_permission_options.fk_option = 'access_justice'

    UNION

    -- permissions par utilisateur
    SELECT
      'user' AS level,
      users.user_id,
      permissions.fk_feature,
      permissions.fk_entity,
      permissions.allowed,
      permissions.type::text::enum_intervention_areas_type,
      permissions.fk_region,
      permissions.fk_departement,
      permissions.fk_epci,
      permissions.fk_city
    FROM permissions
    LEFT JOIN users ON permissions.fk_user = users.user_id
    WHERE permissions.fk_user IS NOT NULL
) t`;
