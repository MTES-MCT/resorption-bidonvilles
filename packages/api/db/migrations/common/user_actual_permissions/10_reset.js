module.exports = `
CREATE OR REPLACE VIEW user_actual_permissions AS (
    SELECT
        t.level,
        t.permission_id,
        t.role,
        t.organization_id,
        t.user_id,
        t.feature,
        t.entity,
        t.is_writing,
        t.allowed,
        CASE
            WHEN t.allowed AND t.regions IS NULL THEN TRUE
            ELSE FALSE
        END AS allow_all,
        t.regions,
        t.departements,
        t.epci,
        t.cities,
        t.shantytowns,
        t.actions
    FROM (
        SELECT
            CASE
                WHEN    full_user_permissions_by_user.allowed
                    AND user_permissions_by_option.user_id IS NOT NULL
                    AND user_permissions_by_option.allowed
                    AND user_permissions_by_option.regions IS NOT NULL
                    THEN 'option'
                ELSE 'user'
            END AS level,
            CASE
                WHEN    full_user_permissions_by_user.allowed
                    AND user_permissions_by_option.user_id IS NOT NULL
                    AND user_permissions_by_option.allowed
                    AND user_permissions_by_option.regions IS NOT NULL
                    THEN NULL
                ELSE full_user_permissions_by_user.permission_id
            END AS permission_id,
            full_user_permissions_by_user.role,
            full_user_permissions_by_user.organization_id,
            full_user_permissions_by_user.user_id,
            full_user_permissions_by_user.feature,
            full_user_permissions_by_user.entity,
            full_user_permissions_by_user.is_writing,
            full_user_permissions_by_user.allowed,
            CASE
                WHEN NOT full_user_permissions_by_user.allowed THEN NULL
                WHEN user_permissions_by_option.user_id IS NULL THEN full_user_permissions_by_user.regions
                WHEN NOT user_permissions_by_option.allowed THEN full_user_permissions_by_user.regions
                WHEN user_permissions_by_option.regions IS NULL THEN NULL
                WHEN full_user_permissions_by_user.regions IS NULL THEN NULL
                ELSE full_user_permissions_by_user.regions || user_permissions_by_option.regions
            END AS regions,
            CASE
                WHEN NOT full_user_permissions_by_user.allowed THEN NULL
                WHEN user_permissions_by_option.user_id IS NULL THEN full_user_permissions_by_user.departements
                WHEN NOT user_permissions_by_option.allowed THEN full_user_permissions_by_user.departements
                WHEN user_permissions_by_option.departements IS NULL THEN NULL
                WHEN full_user_permissions_by_user.departements IS NULL THEN NULL
                ELSE full_user_permissions_by_user.departements || user_permissions_by_option.departements
            END AS departements,
            CASE
                WHEN NOT full_user_permissions_by_user.allowed THEN NULL
                WHEN user_permissions_by_option.user_id IS NULL THEN full_user_permissions_by_user.epci
                WHEN NOT user_permissions_by_option.allowed THEN full_user_permissions_by_user.epci
                WHEN user_permissions_by_option.epci IS NULL THEN NULL
                WHEN full_user_permissions_by_user.epci IS NULL THEN NULL
                ELSE full_user_permissions_by_user.epci || user_permissions_by_option.epci
            END AS epci,
            CASE
                WHEN NOT full_user_permissions_by_user.allowed THEN NULL
                WHEN user_permissions_by_option.user_id IS NULL THEN full_user_permissions_by_user.cities
                WHEN NOT user_permissions_by_option.allowed THEN full_user_permissions_by_user.cities
                WHEN user_permissions_by_option.cities IS NULL THEN NULL
                WHEN full_user_permissions_by_user.cities IS NULL THEN NULL
                ELSE full_user_permissions_by_user.cities || user_permissions_by_option.cities
            END AS cities,
            CASE
                WHEN NOT full_user_permissions_by_user.allowed THEN NULL
                WHEN user_permissions_by_option.user_id IS NULL THEN full_user_permissions_by_user.shantytowns
                WHEN NOT user_permissions_by_option.allowed THEN full_user_permissions_by_user.shantytowns
                WHEN user_permissions_by_option.shantytowns IS NULL THEN NULL
                WHEN full_user_permissions_by_user.shantytowns IS NULL THEN NULL
                ELSE full_user_permissions_by_user.shantytowns || user_permissions_by_option.shantytowns
            END AS shantytowns,
            CASE
                WHEN NOT full_user_permissions_by_user.allowed THEN NULL
                WHEN user_permissions_by_option.user_id IS NULL THEN full_user_permissions_by_user.actions
                WHEN NOT user_permissions_by_option.allowed THEN full_user_permissions_by_user.actions
                WHEN user_permissions_by_option.actions IS NULL THEN NULL
                WHEN full_user_permissions_by_user.actions IS NULL THEN NULL
                ELSE full_user_permissions_by_user.actions || user_permissions_by_option.actions
            END AS actions
        FROM full_user_permissions_by_user
        LEFT JOIN user_permissions_by_option ON full_user_permissions_by_user.user_id = user_permissions_by_option.user_id
            AND full_user_permissions_by_user.feature = user_permissions_by_option.feature
            AND full_user_permissions_by_user.entity = user_permissions_by_option.entity
        WHERE full_user_permissions_by_user.level = 'user'

        UNION

        SELECT
            CASE
                WHEN   user_permissions_by_option.user_id IS NULL
                    OR (
                        user_permissions_by_option.allowed
                        AND
                        full_user_permissions_by_user.allowed
                        AND
                        full_user_permissions_by_user.regions IS NULL
                    ) THEN full_user_permissions_by_user.level
                ELSE 'option'
            END AS level,
            CASE
                WHEN   user_permissions_by_option.user_id IS NULL
                    OR (
                        user_permissions_by_option.allowed
                        AND
                        full_user_permissions_by_user.allowed
                        AND
                        full_user_permissions_by_user.regions IS NULL
                    ) THEN full_user_permissions_by_user.permission_id
                ELSE NULL
            END AS permission_id,
            full_user_permissions_by_user.role,
            full_user_permissions_by_user.organization_id,
            full_user_permissions_by_user.user_id,
            full_user_permissions_by_user.feature,
            full_user_permissions_by_user.entity,
            full_user_permissions_by_user.is_writing,
            COALESCE(user_permissions_by_option.allowed, full_user_permissions_by_user.allowed) AS allowed,
            CASE
                WHEN user_permissions_by_option.user_id IS NULL THEN full_user_permissions_by_user.regions
                WHEN NOT user_permissions_by_option.allowed THEN NULL
                WHEN user_permissions_by_option.regions IS NULL THEN NULL
                WHEN NOT full_user_permissions_by_user.allowed THEN user_permissions_by_option.regions
                WHEN full_user_permissions_by_user.regions IS NULL THEN NULL
                ELSE full_user_permissions_by_user.regions || user_permissions_by_option.regions
            END AS regions,
            CASE
                WHEN user_permissions_by_option.user_id IS NULL THEN full_user_permissions_by_user.departements
                WHEN NOT user_permissions_by_option.allowed THEN NULL
                WHEN user_permissions_by_option.departements IS NULL THEN NULL
                WHEN NOT full_user_permissions_by_user.allowed THEN user_permissions_by_option.departements
                WHEN full_user_permissions_by_user.departements IS NULL THEN NULL
                ELSE full_user_permissions_by_user.departements || user_permissions_by_option.departements
            END AS departements,
            CASE
                WHEN user_permissions_by_option.user_id IS NULL THEN full_user_permissions_by_user.epci
                WHEN NOT user_permissions_by_option.allowed THEN NULL
                WHEN user_permissions_by_option.epci IS NULL THEN NULL
                WHEN NOT full_user_permissions_by_user.allowed THEN user_permissions_by_option.epci
                WHEN full_user_permissions_by_user.epci IS NULL THEN NULL
                ELSE full_user_permissions_by_user.epci || user_permissions_by_option.epci
            END AS epci,
            CASE
                WHEN user_permissions_by_option.user_id IS NULL THEN full_user_permissions_by_user.cities
                WHEN NOT user_permissions_by_option.allowed THEN NULL
                WHEN user_permissions_by_option.cities IS NULL THEN NULL
                WHEN NOT full_user_permissions_by_user.allowed THEN user_permissions_by_option.cities
                WHEN full_user_permissions_by_user.cities IS NULL THEN NULL
                ELSE full_user_permissions_by_user.cities || user_permissions_by_option.cities
            END AS cities,
            CASE
                WHEN user_permissions_by_option.user_id IS NULL THEN full_user_permissions_by_user.shantytowns
                WHEN NOT user_permissions_by_option.allowed THEN NULL
                WHEN user_permissions_by_option.shantytowns IS NULL THEN NULL
                WHEN NOT full_user_permissions_by_user.allowed THEN user_permissions_by_option.shantytowns
                WHEN full_user_permissions_by_user.shantytowns IS NULL THEN NULL
                ELSE full_user_permissions_by_user.shantytowns || user_permissions_by_option.shantytowns
            END AS shantytowns,
            CASE
                WHEN user_permissions_by_option.user_id IS NULL THEN full_user_permissions_by_user.actions
                WHEN NOT user_permissions_by_option.allowed THEN NULL
                WHEN user_permissions_by_option.actions IS NULL THEN NULL
                WHEN NOT full_user_permissions_by_user.allowed THEN user_permissions_by_option.actions
                WHEN full_user_permissions_by_user.actions IS NULL THEN NULL
                ELSE full_user_permissions_by_user.actions || user_permissions_by_option.actions
            END AS actions
        FROM full_user_permissions_by_user
        LEFT JOIN user_permissions_by_option ON full_user_permissions_by_user.user_id = user_permissions_by_option.user_id
            AND full_user_permissions_by_user.feature = user_permissions_by_option.feature
            AND full_user_permissions_by_user.entity = user_permissions_by_option.entity
        WHERE full_user_permissions_by_user.level <> 'user'
    ) t
)`;
