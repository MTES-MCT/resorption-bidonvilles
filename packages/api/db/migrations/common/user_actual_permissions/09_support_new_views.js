module.exports = (queryInterface, transaction) => queryInterface.sequelize.query(
    `CREATE OR REPLACE VIEW user_actual_permissions AS
    
    SELECT * FROM (
        SELECT
            t.*,
            RANK() OVER(
                PARTITION BY t.fk_user, t.fk_entity, t.fk_feature ORDER BY priority ASC
            ) AS "rank"
        FROM (
            (
                SELECT
                    1 as priority,
                    'user' as level,
                    user_id AS fk_user,
                    fk_feature,
                    fk_entity,
                    is_writing,
                    allowed,
                    allow_all,
                    regions,
                    departements,
                    epci,
                    cities,
                    shantytowns,
                    plans,
                    actions
                FROM
                    user_permissions_by_user
            )
            UNION
            (
                SELECT
                    2 as priority,
                    'role_admin' as level,
                    user_id AS fk_user,
                    fk_feature,
                    fk_entity,
                    is_writing,
                    allowed,
                    allow_all,
                    regions,
                    departements,
                    epci,
                    cities,
                    shantytowns,
                    plans,
                    actions
                FROM
                    user_permissions_by_role
                WHERE role IN ('national_admin', 'local_admin')
            )
            UNION
            (
                SELECT
                    3 as priority,
                    'option' as level,
                    user_id AS fk_user,
                    fk_feature,
                    fk_entity,
                    is_writing,
                    allowed,
                    allow_all,
                    regions,
                    departements,
                    epci,
                    cities,
                    shantytowns,
                    plans,
                    actions
                FROM
                    user_permissions_by_option
            )
            UNION
            (
                SELECT
                    4 as priority,
                    'organization' as level,
                    user_id AS fk_user,
                    fk_feature,
                    fk_entity,
                    is_writing,
                    allowed,
                    allow_all,
                    regions,
                    departements,
                    epci,
                    cities,
                    shantytowns,
                    plans,
                    actions
                FROM
                    user_permissions_by_org
            )
            UNION
            (
                SELECT
                    5 as priority,
                    'role_regular' as level,
                    user_id AS fk_user,
                    fk_feature,
                    fk_entity,
                    is_writing,
                    allowed,
                    allow_all,
                    regions,
                    departements,
                    epci,
                    cities,
                    shantytowns,
                    plans,
                    actions
                FROM
                    user_permissions_by_role
                WHERE role NOT IN ('national_admin', 'local_admin')
            )
        ) t
    ) t2
    WHERE rank = 1`,
    { transaction },
);
