module.exports = {
    up: queryInterface => queryInterface.sequelize.query(
        `INSERT INTO permissions(fk_user, fk_organization, fk_feature, fk_entity, allowed, type, fk_region, fk_departement, fk_epci, fk_city)
        SELECT
            user_permissions.fk_user,
            user_permissions.fk_organization,
            user_permissions.fk_feature,
            user_permissions.fk_entity,
            user_permissions.allowed,
            (CASE
                WHEN user_permissions.allowed IS FALSE THEN NULL
                WHEN user_permissions.allow_all IS TRUE THEN 'nation'::enum_permissions_type
                WHEN upa.fk_region IS NOT NULL THEN 'region'::enum_permissions_type
                WHEN upa.fk_departement IS NOT NULL THEN 'departement'::enum_permissions_type
                WHEN upa.fk_epci IS NOT NULL THEN 'epci'::enum_permissions_type
                WHEN upa.fk_city IS NOT NULL THEN 'city'::enum_permissions_type
            END),
            upa.fk_region,
            upa.fk_departement,
            upa.fk_epci,
            upa.fk_city
        FROM user_permissions
        LEFT JOIN user_permission_attachments upa ON
            upa.fk_user_permission = user_permissions.user_permission_id
            AND
            upa.fk_shantytown IS NULL
            AND
            upa.fk_action IS NULL AND upa.fk_plan IS NULL
        WHERE upa.fk_user_permission IS NOT NULL OR user_permissions.allowed IS FALSE OR user_permissions.allow_all IS TRUE`,
    ),

    down: queryInterface => queryInterface.sequelize.query('DELETE FROM permissions'),
};
