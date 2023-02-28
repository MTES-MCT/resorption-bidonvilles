module.exports = `
CREATE OR REPLACE VIEW user_permissions_by_org AS SELECT
    t.user_id,
    t.fk_organization,
    t.fk_feature,
    t.fk_entity,
    t.is_writing,
    t.allowed,
    t.allow_all,
    CASE
        WHEN t.allowed IS FALSE OR t.allow_all IS TRUE THEN null
        WHEN t.is_cumulative IS FALSE THEN upwa.regions
        ELSE t.upbr_regions || upwa.regions
    END AS regions,
    CASE
        WHEN t.allowed IS FALSE OR t.allow_all IS TRUE THEN null
        WHEN t.is_cumulative IS FALSE THEN upwa.departements
        ELSE t.upbr_departements || upwa.departements
    END AS departements,
    CASE
        WHEN t.allowed IS FALSE OR t.allow_all IS TRUE THEN null
        WHEN t.is_cumulative IS FALSE THEN upwa.epci
        ELSE t.upbr_epci || upwa.epci
    END AS epci,
    CASE
        WHEN t.allowed IS FALSE OR t.allow_all IS TRUE THEN null
        WHEN t.is_cumulative IS FALSE THEN upwa.cities
        ELSE t.upbr_cities || upwa.cities
    END AS cities,
    CASE
        WHEN t.allowed IS FALSE OR t.allow_all IS TRUE THEN null
        WHEN t.is_cumulative IS FALSE THEN upwa.shantytowns
        ELSE t.upbr_shantytowns || upwa.shantytowns
    END AS shantytowns,
    CASE
        WHEN t.allowed IS FALSE OR t.allow_all IS TRUE THEN null
        WHEN t.is_cumulative IS FALSE THEN upwa.plans
        ELSE t.upbr_plans || upwa.plans
    END AS plans,
    CASE
        WHEN t.allowed IS FALSE OR t.allow_all IS TRUE THEN null
        WHEN t.is_cumulative IS FALSE THEN upwa.actions
        ELSE t.upbr_actions || upwa.actions
    END AS actions
FROM (
    SELECT
        user_permissions.user_permission_id,
        users.user_id,
        users.fk_organization,
        user_permissions.fk_feature,
        user_permissions.fk_entity,
        upbr.is_writing,
        user_permissions.allowed,
        CASE
            WHEN user_permissions.allowed IS FALSE THEN NULL
            WHEN user_permissions.is_cumulative IS FALSE THEN user_permissions.allow_all
            ELSE user_permissions.allow_all IS TRUE OR upbr.allow_all IS TRUE
        END AS allow_all,
        user_permissions.is_cumulative,
        COALESCE(upbr.regions, array[]::varchar[]) AS upbr_regions,
        COALESCE(upbr.departements, array[]::varchar[]) AS upbr_departements,
        COALESCE(upbr.epci, array[]::varchar[]) AS upbr_epci,
        COALESCE(upbr.cities, array[]::varchar[]) AS upbr_cities,
        COALESCE(upbr.shantytowns, array[]::integer[]) AS upbr_shantytowns,
        COALESCE(upbr.plans, array[]::integer[]) AS upbr_plans,
        COALESCE(upbr.actions, array[]::integer[]) AS upbr_actions
    FROM user_permissions
    LEFT JOIN users ON user_permissions.fk_organization = users.fk_organization
    LEFT JOIN user_permissions_by_role upbr ON upbr.user_id = users.user_id AND upbr.fk_feature = user_permissions.fk_feature AND upbr.fk_entity = user_permissions.fk_entity
    WHERE user_permissions.fk_organization IS NOT NULL
    ORDER BY users.fk_organization ASC, users.user_id ASC
) t
LEFT JOIN user_permissions_with_attachments upwa ON upwa.user_permission_id = t.user_permission_id`;
