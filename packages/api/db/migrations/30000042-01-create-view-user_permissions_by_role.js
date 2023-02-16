// actions
module.exports = {
    up: queryInterface => queryInterface.sequelize.query(
        `CREATE OR REPLACE VIEW user_permissions_by_role AS SELECT
            rusers.user_id,
            rusers.role,
            features.name AS fk_feature,
            features.fk_entity AS fk_entity,
            features.is_writing,
            role_permissions.allowed,
            CASE
                WHEN role_permissions.allowed IS TRUE THEN role_permissions.allow_all
            ELSE NULL
            END AS allow_all,
            CASE
                WHEN role_permissions.allowed IS FALSE OR role_permissions.allow_all IS TRUE THEN NULL
            WHEN features.is_writing IS TRUE THEN COALESCE(lwl.regions, array[]::varchar[])
            ELSE COALESCE(lrl.regions, array[]::varchar[])
            END AS regions,
            CASE
                WHEN role_permissions.allowed IS FALSE OR role_permissions.allow_all IS TRUE THEN NULL
            WHEN features.is_writing IS TRUE THEN COALESCE(lwl.departements, array[]::varchar[])
            ELSE COALESCE(lrl.departements, array[]::varchar[])
            END AS departements,
            CASE
                WHEN role_permissions.allowed IS FALSE OR role_permissions.allow_all IS TRUE THEN NULL
            WHEN features.is_writing IS TRUE THEN COALESCE(lwl.epci, array[]::varchar[])
            ELSE COALESCE(lrl.epci, array[]::varchar[])
            END AS epci,
            CASE
                WHEN role_permissions.allowed IS FALSE OR role_permissions.allow_all IS TRUE THEN NULL
            WHEN features.is_writing IS TRUE THEN COALESCE(lwl.cities, array[]::varchar[])
            ELSE COALESCE(lrl.cities, array[]::varchar[])
            END AS cities,
            CASE
                WHEN role_permissions.allowed IS FALSE OR role_permissions.allow_all IS TRUE THEN NULL
            WHEN features.is_writing IS TRUE THEN COALESCE(lwl.shantytowns, array[]::integer[])
            ELSE COALESCE(lrl.shantytowns, array[]::integer[])
            END AS shantytowns,
            CASE
                WHEN role_permissions.allowed IS FALSE OR role_permissions.allow_all IS TRUE THEN NULL
            WHEN features.is_writing IS TRUE THEN COALESCE(lwl.plans, array[]::integer[])
            ELSE COALESCE(lrl.plans, array[]::integer[])
            END AS plans,
            CASE
                WHEN role_permissions.allowed IS FALSE OR role_permissions.allow_all IS TRUE THEN NULL
            WHEN features.is_writing IS TRUE THEN COALESCE(lwl.actions, array[]::integer[])
            ELSE COALESCE(lrl.actions, array[]::integer[])
            END AS actions
        FROM (
            SELECT
                users.user_id,
                COALESCE(users.fk_role, users.fk_role_regular) AS role
            FROM users
        ) rusers
        LEFT JOIN local_writing_locations lwl ON lwl.user_id = rusers.user_id
        LEFT JOIN local_reading_locations lrl ON lrl.user_id = rusers.user_id
        LEFT JOIN role_permissions ON rusers.role = role_permissions.fk_role_admin OR rusers.role = role_permissions.fk_role_regular
        LEFT JOIN features ON role_permissions.fk_feature = features.name AND role_permissions.fk_entity = features.fk_entity
        ORDER BY features.fk_entity ASC, features.name ASC`,
    ),

    down: queryInterface => queryInterface.sequelize.query(
        'DROP VIEW user_permissions_by_role',
    ),
};
