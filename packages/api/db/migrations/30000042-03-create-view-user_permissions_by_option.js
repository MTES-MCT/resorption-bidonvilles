// actions
module.exports = {
    up: queryInterface => queryInterface.sequelize.query(
        `CREATE OR REPLACE VIEW user_permissions_by_option AS
        SELECT
          user_permission_options.fk_user AS user_id,
          user_permission_options.fk_option AS option_id,
          'close' AS fk_feature,
          'shantytown' AS fk_entity,
          TRUE AS is_writing,
          TRUE AS allowed,
          CASE
              WHEN local_writing_locations.regions IS NULL THEN TRUE
              ELSE FALSE
          END AS allow_all,
          CASE
              WHEN local_writing_locations.regions IS NULL THEN NULL
              ELSE local_writing_locations.regions
          END AS regions,
          CASE
              WHEN local_writing_locations.departements IS NULL THEN NULL
              ELSE local_writing_locations.departements
          END AS departements,
          CASE
              WHEN local_writing_locations.epci IS NULL THEN NULL
              ELSE local_writing_locations.epci
          END AS epci,
          CASE
              WHEN local_writing_locations.cities IS NULL THEN NULL
              ELSE local_writing_locations.cities
          END AS cities,
          CASE
              WHEN local_writing_locations.shantytowns IS NULL THEN NULL
              ELSE local_writing_locations.shantytowns
          END AS shantytowns,
          CASE
              WHEN local_writing_locations.plans IS NULL THEN NULL
              ELSE local_writing_locations.plans
          END AS plans,
          CASE
              WHEN local_writing_locations.actions IS NULL THEN NULL
              ELSE local_writing_locations.actions
          END AS actions
        FROM user_permission_options
        LEFT JOIN local_writing_locations ON user_permission_options.fk_user = local_writing_locations.user_id
        WHERE fk_option IN ('close_shantytown', 'create_and_close_shantytown')
        
        UNION
        
        SELECT
          user_permission_options.fk_user AS user_id,
          user_permission_options.fk_option AS option_id,
          'create' AS fk_feature,
          'shantytown' AS fk_entity,
          TRUE AS is_writing,
          TRUE AS allowed,
          CASE
              WHEN local_writing_locations.regions IS NULL THEN TRUE
              ELSE FALSE
          END AS allow_all,
          CASE
              WHEN local_writing_locations.regions IS NULL THEN NULL
              ELSE local_writing_locations.regions
          END AS regions,
          CASE
              WHEN local_writing_locations.departements IS NULL THEN NULL
              ELSE local_writing_locations.departements
          END AS departements,
          CASE
              WHEN local_writing_locations.epci IS NULL THEN NULL
              ELSE local_writing_locations.epci
          END AS epci,
          CASE
              WHEN local_writing_locations.cities IS NULL THEN NULL
              ELSE local_writing_locations.cities
          END AS cities,
          CASE
              WHEN local_writing_locations.shantytowns IS NULL THEN NULL
              ELSE local_writing_locations.shantytowns
          END AS shantytowns,
          CASE
              WHEN local_writing_locations.plans IS NULL THEN NULL
              ELSE local_writing_locations.plans
          END AS plans,
          CASE
              WHEN local_writing_locations.actions IS NULL THEN NULL
              ELSE local_writing_locations.actions
          END AS actions
        FROM user_permission_options
        LEFT JOIN local_writing_locations ON user_permission_options.fk_user = local_writing_locations.user_id
        WHERE fk_option IN ('create_and_close_shantytown')
        
        UNION
        
        SELECT
          user_permission_options.fk_user AS user_id,
          user_permission_options.fk_option AS option_id,
          'access' AS fk_feature,
          'shantytown_justice' AS fk_entity,
          FALSE AS is_writing,
          TRUE AS allowed,
          FALSE AS allow_all,
          NULL AS regions,
          NULL AS departements,
          NULL AS epci,
          NULL AS cities,
          NULL AS shantytowns,
          NULL AS plans,
          NULL AS actions
        FROM user_permission_options
        WHERE fk_option IN ('access_justice')`,
    ),

    down: queryInterface => queryInterface.sequelize.query(
        'DROP VIEW user_permissions_by_option',
    ),
};
