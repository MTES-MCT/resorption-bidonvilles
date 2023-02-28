module.exports = `
CREATE OR REPLACE VIEW user_permissions_with_attachments AS SELECT
    up.user_permission_id,
    (array_agg(up.fk_organization))[1] AS fk_organization,
    (array_agg(up.fk_user))[1] AS fk_user,
    (array_agg(up.fk_feature))[1] AS fk_feature,
    (array_agg(up.fk_entity))[1] AS fk_entity,
    (array_agg(up.allowed))[1] AS allowed,
    (array_agg(up.allow_all))[1] AS allow_all,
    CASE
        WHEN (array_agg(up.allowed))[1] = FALSE OR (array_agg(up.allow_all))[1] = TRUE THEN NULL
        ELSE array_remove(array_agg(upa.fk_region), null)
    END AS regions,
    CASE
        WHEN (array_agg(up.allowed))[1] = FALSE OR (array_agg(up.allow_all))[1] = TRUE THEN NULL
        ELSE array_remove(array_agg(upa.fk_departement), null)
    END AS departements,
    CASE
        WHEN (array_agg(up.allowed))[1] = FALSE OR (array_agg(up.allow_all))[1] = TRUE THEN NULL
        ELSE array_remove(array_agg(upa.fk_epci), null)
    END AS epci,
    CASE
        WHEN (array_agg(up.allowed))[1] = FALSE OR (array_agg(up.allow_all))[1] = TRUE THEN NULL
        ELSE array_remove(array_agg(upa.fk_city), null)
    END AS cities,
    CASE
        WHEN (array_agg(up.allowed))[1] = FALSE OR (array_agg(up.allow_all))[1] = TRUE THEN NULL
        ELSE array_remove(array_agg(upa.fk_shantytown), null)
    END AS shantytowns,
    CASE
        WHEN (array_agg(up.allowed))[1] = FALSE OR (array_agg(up.allow_all))[1] = TRUE THEN NULL
        ELSE array_remove(array_agg(upa.fk_plan), null)
    END AS plans,
    CASE
        WHEN (array_agg(up.allowed))[1] = FALSE OR (array_agg(up.allow_all))[1] = TRUE THEN NULL
        ELSE array_remove(array_agg(upa.fk_action), null)
    END AS actions
FROM user_permissions up
LEFT JOIN user_permission_attachments upa ON upa.fk_user_permission = up.user_permission_id
GROUP BY up.user_permission_id`;
