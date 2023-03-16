module.exports = `
CREATE OR REPLACE VIEW full_user_permissions_by_role AS (
    SELECT
        'role' AS level,
        full_role_permissions.permission_id,
        full_role_permissions.role,
        users.user_id,
        full_role_permissions.feature,
        full_role_permissions.entity,
        full_role_permissions.is_writing,
        full_role_permissions.allowed,
        CASE
            WHEN NOT full_role_permissions.allowed THEN NULL
            WHEN full_role_permissions.allow_all THEN NULL
            WHEN full_role_permissions.entity = 'action' THEN local_reading_locations.regions
            WHEN full_role_permissions.is_writing THEN local_writing_locations.regions
            ELSE local_reading_locations.regions
        END AS regions,
        CASE
            WHEN NOT full_role_permissions.allowed THEN NULL
            WHEN full_role_permissions.allow_all THEN NULL
            WHEN full_role_permissions.entity = 'action' THEN local_reading_locations.departements
            WHEN full_role_permissions.is_writing THEN local_writing_locations.departements
            ELSE local_reading_locations.departements
        END AS departements,
        CASE
            WHEN NOT full_role_permissions.allowed THEN NULL
            WHEN full_role_permissions.allow_all THEN NULL
            WHEN full_role_permissions.entity = 'action' THEN local_reading_locations.epci
            WHEN full_role_permissions.is_writing THEN local_writing_locations.epci
            ELSE local_reading_locations.epci
        END AS epci,
        CASE
            WHEN NOT full_role_permissions.allowed THEN NULL
            WHEN full_role_permissions.allow_all THEN NULL
            WHEN full_role_permissions.entity = 'action' THEN local_reading_locations.cities
            WHEN full_role_permissions.is_writing THEN local_writing_locations.cities
            ELSE local_reading_locations.cities
        END AS cities,
        CASE
            WHEN NOT full_role_permissions.allowed THEN NULL
            WHEN full_role_permissions.allow_all THEN NULL
            WHEN full_role_permissions.entity = 'action' THEN local_reading_locations.shantytowns
            WHEN full_role_permissions.is_writing THEN local_writing_locations.shantytowns
            ELSE local_reading_locations.shantytowns
        END AS shantytowns,
        CASE
            WHEN NOT full_role_permissions.allowed THEN NULL
            WHEN full_role_permissions.allow_all THEN NULL
            WHEN full_role_permissions.entity = 'action' THEN local_reading_locations.actions
            WHEN full_role_permissions.is_writing THEN local_writing_locations.actions
            ELSE local_reading_locations.actions
        END AS actions
    FROM users
    LEFT JOIN full_role_permissions ON COALESCE(users.fk_role, users.fk_role_regular) = full_role_permissions.role
    LEFT JOIN local_reading_locations ON users.fk_organization = local_reading_locations.organization_id
    LEFT JOIN local_writing_locations ON users.fk_organization = local_writing_locations.organization_id
)`;
