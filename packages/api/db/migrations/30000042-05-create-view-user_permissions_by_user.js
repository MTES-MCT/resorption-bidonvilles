// actions
module.exports = {
    up: queryInterface => queryInterface.sequelize.query(
        `CREATE OR REPLACE VIEW user_permissions_by_user AS SELECT
          t.user_id,
          t.fk_feature,
          t.fk_entity,
          t.is_writing,
          t.allowed,
          t.allow_all,
          CASE
              WHEN t.allowed IS FALSE OR t.allow_all IS TRUE THEN null
            WHEN t.is_cumulative IS FALSE THEN upwa.regions
            ELSE t.upbo_regions || upwa.regions
          END AS regions,
          CASE
              WHEN t.allowed IS FALSE OR t.allow_all IS TRUE THEN null
            WHEN t.is_cumulative IS FALSE THEN upwa.departements
            ELSE t.upbo_departements || upwa.departements
          END AS departements,
          CASE
              WHEN t.allowed IS FALSE OR t.allow_all IS TRUE THEN null
            WHEN t.is_cumulative IS FALSE THEN upwa.epci
            ELSE t.upbo_epci || upwa.epci
          END AS epci,
          CASE
              WHEN t.allowed IS FALSE OR t.allow_all IS TRUE THEN null
            WHEN t.is_cumulative IS FALSE THEN upwa.cities
            ELSE t.upbo_cities || upwa.cities
          END AS cities,
          CASE
              WHEN t.allowed IS FALSE OR t.allow_all IS TRUE THEN null
            WHEN t.is_cumulative IS FALSE THEN upwa.shantytowns
            ELSE t.upbo_shantytowns || upwa.shantytowns
          END AS shantytowns,
          CASE
              WHEN t.allowed IS FALSE OR t.allow_all IS TRUE THEN null
            WHEN t.is_cumulative IS FALSE THEN upwa.plans
            ELSE t.upbo_plans || upwa.plans
          END AS plans,
          CASE
              WHEN t.allowed IS FALSE OR t.allow_all IS TRUE THEN null
            WHEN t.is_cumulative IS FALSE THEN upwa.actions
            ELSE t.upbo_actions || upwa.actions
          END AS actions
        FROM (
          SELECT
            user_permissions.user_permission_id,
            user_permissions.fk_user AS user_id,
            user_permissions.fk_feature,
            user_permissions.fk_entity,
            upbo.is_writing,
            user_permissions.allowed,
            CASE
              WHEN user_permissions.allowed IS FALSE THEN NULL
              WHEN user_permissions.is_cumulative IS FALSE THEN user_permissions.allow_all
              ELSE user_permissions.allow_all IS TRUE OR upbo.allow_all IS TRUE
            END AS allow_all,
            user_permissions.is_cumulative,
            COALESCE(upbo.regions, array[]::varchar[]) AS upbo_regions,
            COALESCE(upbo.departements, array[]::varchar[]) AS upbo_departements,
            COALESCE(upbo.epci, array[]::varchar[]) AS upbo_epci,
            COALESCE(upbo.cities, array[]::varchar[]) AS upbo_cities,
            COALESCE(upbo.shantytowns, array[]::integer[]) AS upbo_shantytowns,
            COALESCE(upbo.plans, array[]::integer[]) AS upbo_plans,
            COALESCE(upbo.actions, array[]::integer[]) AS upbo_actions
          FROM user_permissions
          LEFT JOIN user_permissions_by_org upbo ON upbo.user_id = user_permissions.fk_user AND upbo.fk_feature = user_permissions.fk_feature AND upbo.fk_entity = user_permissions.fk_entity
          WHERE user_permissions.fk_user IS NOT NULL
          ORDER BY user_permissions.fk_user ASC
        ) t
        LEFT JOIN user_permissions_with_attachments upwa ON upwa.user_permission_id = t.user_permission_id`,
    ),

    down: queryInterface => queryInterface.sequelize.query(
        'DROP VIEW user_permissions_by_user',
    ),
};
