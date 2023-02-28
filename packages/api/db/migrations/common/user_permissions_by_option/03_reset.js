module.exports = `
CREATE OR REPLACE VIEW user_permissions_by_option AS SELECT
    user_permission_options.fk_user AS user_id,
    user_permission_options.fk_option AS option,
    CASE
        WHEN user_permission_options.fk_option = 'access_justice' THEN 'access'
        WHEN user_permission_options.fk_option = 'create_shantytown' THEN 'create'
        WHEN user_permission_options.fk_option = 'close_shantytown' THEN 'close'
        ELSE NULL
    END AS feature,
    CASE
        WHEN user_permission_options.fk_option = 'access_justice' THEN 'shantytown_justice'
        WHEN user_permission_options.fk_option = 'create_shantytown' THEN 'shantytown'
        WHEN user_permission_options.fk_option = 'close_shantytown' THEN 'shantytown'
        ELSE NULL
    END AS entity,
    CASE
        WHEN user_permission_options.fk_option = 'access_justice' THEN FALSE
        WHEN user_permission_options.fk_option = 'create_shantytown' THEN TRUE
        WHEN user_permission_options.fk_option = 'close_shantytown' THEN TRUE
        ELSE NULL
    END AS is_writing,
    user_permissions.allowed AS allowed,
    user_permissions.regions,
    user_permissions.departements,
    user_permissions.epci,
    user_permissions.cities,
    user_permissions.shantytowns,
    user_permissions.actions
FROM user_permission_options
LEFT JOIN full_user_permissions_by_user user_permissions ON user_permissions.user_id = user_permission_options.fk_user
    AND user_permissions.feature = 'list'
    AND user_permissions.entity = 'shantytown'`;
