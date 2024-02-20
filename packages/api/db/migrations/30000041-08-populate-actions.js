// actions
module.exports = {
    async up(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await queryInterface.sequelize.query(
                `
                INSERT INTO actions(
                    action_id,
                    name,
                    started_at,
                    ended_at,
                    goals,
                    fk_departement,
                    location_type,
                    address,
                    latitude,
                    longitude,
                    eti_fk_city,
                    location_other,
                    created_by,
                    created_at,
                    updated_by,
                    updated_at
                )
                WITH locations_with_city AS (
                    SELECT
                        t.location_id,
                        t.address,
                        t.latitude,
                        t.longitude,
                        c.code
                    FROM (
                      SELECT
                          location_id,
                          address,
                          latitude,
                          longitude,
                        (regexp_matches(address, '([^ ,]+),? .{2},'))[1] AS city_name,
                        (regexp_matches(address, '([^ ,]+),? (.{2}),'))[2] AS departement_code
                          FROM locations
                    ) t
                    LEFT JOIN cities c ON c.name = t.city_name
                    WHERE c.fk_departement = t.departement_code
                  )
                SELECT
                    plans2.plan_id,
                    plans2.name,
                    plans2.started_at,
                    COALESCE(plans2.closed_at, plans2.expected_to_end_at) AS ended_at,
                    plans2.goals,
                    plan_departements.fk_departement,
                    CASE plans2.location_type
                        WHEN 'housing' THEN 'logement'::enum_actions_location_type
                        WHEN 'location' THEN 'eti'::enum_actions_location_type
                        WHEN 'shantytowns' THEN 'sur_site'::enum_actions_location_type
                        ELSE 'autre'::enum_actions_location_type
                    END AS location_type,
                    locations.address,
                    locations.latitude,
                    locations.longitude,
                    locations.code,
                    CASE plans2.location_type
                        WHEN 'other' THEN plans2.location_details
                        ELSE NULL
                    END AS location_other,
                    plans2.created_by,
                    plans2.created_at,
                    plans2.updated_by,
                    plans2.updated_at
                FROM plans2
                LEFT JOIN plan_departements ON plan_departements.fk_plan = plans2.plan_id
                LEFT JOIN locations_with_city as locations ON plans2.fk_location = locations.location_id
            `,
                {
                    transaction,
                },
            );
            await queryInterface.sequelize.query(
                `
                INSERT INTO actions_history(
                    hid,
                    action_id,
                    name,
                    started_at,
                    ended_at,
                    goals,
                    fk_departement,
                    location_type,
                    address,
                    latitude,
                    longitude,
                    eti_fk_city,
                    location_other,
                    created_by,
                    created_at,
                    updated_by,
                    updated_at
                )

                WITH locations_with_city AS (
                    SELECT
                        t.location_id,
                        t.address,
                        t.latitude,
                        t.longitude,
                        c.code
                    FROM (
                      SELECT
                          location_id,
                          address,
                          latitude,
                          longitude,
                        (regexp_matches(address, '([^ ,]+),? .{2},'))[1] AS city_name,
                        (regexp_matches(address, '([^ ,]+),? (.{2}),'))[2] AS departement_code
                          FROM locations
                    ) t
                    LEFT JOIN cities c ON c.name = t.city_name
                    WHERE c.fk_departement = t.departement_code
                  )                  
                SELECT
                    plans_history.hid,
                    plans_history.plan_id,
                    plans_history.name,
                    plans_history.started_at,
                    COALESCE(plans_history.closed_at, plans_history.expected_to_end_at) AS ended_at,
                    plans_history.goals,
                    plan_departements.fk_departement,
                    CASE plans_history.location_type
                        WHEN 'housing' THEN 'logement'::enum_actions_history_location_type
                        WHEN 'location' THEN 'eti'::enum_actions_history_location_type
                        WHEN 'shantytowns' THEN 'sur_site'::enum_actions_history_location_type
                        ELSE 'autre'::enum_actions_history_location_type
                    END AS location_type,
                    locations.address,
                    locations.latitude,
                    locations.longitude,
                    locations.code,
                    CASE plans_history.location_type
                        WHEN 'other' THEN plans_history.location_details
                        ELSE NULL
                    END AS location_other,
                    plans_history.created_by,
                    plans_history.created_at,
                    plans_history.updated_by,
                    plans_history.updated_at
                FROM plans_history
                LEFT JOIN plan_departements ON plan_departements.fk_plan = plans_history.plan_id
                LEFT JOIN locations_with_city as locations ON plans_history.fk_location = locations.location_id
            `,
                {
                    transaction,
                },
            );

            // reset sequence of primary key
            const [max, maxHistory] = await Promise.all([
                queryInterface.sequelize.query(
                    'SELECT action_id AS max FROM actions ORDER BY action_id DESC LIMIT 1',
                    {
                        type: queryInterface.sequelize.QueryTypes.SELECT,
                        transaction,
                    },
                ),
                queryInterface.sequelize.query(
                    'SELECT hid AS "maxHistory" FROM actions_history ORDER BY hid DESC LIMIT 1',
                    {
                        type: queryInterface.sequelize.QueryTypes.SELECT,
                        transaction,
                    },
                ),
            ]);
            if (max.length > 0) {
                await Promise.all([
                    queryInterface.sequelize.query(
                        'ALTER SEQUENCE actions_action_id_seq RESTART WITH :max',
                        {
                            transaction,
                            replacements: {
                                max: parseInt(max[0].max, 10) + 1,
                            },
                        },
                    ),
                    queryInterface.sequelize.query(
                        'ALTER SEQUENCE actions_history_hid_seq RESTART WITH :max',
                        {
                            transaction,
                            replacements: {
                                max: parseInt(maxHistory[0].maxHistory, 10) + 1,
                            },
                        },
                    ),
                ]);
            }

            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await queryInterface.sequelize.query(
                'DELETE FROM actions_history',
                { transaction },
            );
            await queryInterface.sequelize.query(
                'DELETE FROM actions',
                { transaction },
            );
            return transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
