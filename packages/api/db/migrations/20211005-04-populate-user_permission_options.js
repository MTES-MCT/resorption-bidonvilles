module.exports = {

    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            `SELECT *
             FROM
                (
                    (
                        SELECT user_id AS fk_user, 'close_shantytown' AS fk_option
                        FROM (
                            SELECT u.user_id, ARRAY_AGG(uap.fk_feature || '.' || uap.fk_entity || '.' || uap.allowed || '.' || uap.fk_geographic_level) AS permissions
                            FROM user_actual_permissions uap
                            LEFT JOIN users u ON u.user_id = uap.user_id
                            LEFT JOIN organizations o ON u.fk_organization = o.organization_id
                            LEFT JOIN organization_types ot ON o.fk_type = ot.organization_type_id
                            WHERE uap.fk_organization IS NOT NULL AND ot.fk_role = 'collaborator'
                            GROUP BY u.user_id
                        ) t
                        WHERE permissions @> '{"close.shantytown.true.local"}'
                    )
                    UNION
                    (
                        SELECT user_id AS fk_user, 'hide_justice' AS fk_option
                        FROM (
                            SELECT u.user_id, ARRAY_AGG(uap.fk_feature || '.' || uap.fk_entity || '.' || uap.allowed) AS permissions
                            FROM user_actual_permissions uap
                            LEFT JOIN users u ON u.user_id = uap.user_id
                            LEFT JOIN organizations o ON u.fk_organization = o.organization_id
                            LEFT JOIN organization_types ot ON o.fk_type = ot.organization_type_id
                            WHERE uap.fk_organization IS NOT NULL AND ot.fk_role IN ('collaborator', 'association', 'intervener')
                            GROUP BY u.user_id
                        ) t
                        WHERE permissions @> '{"access.shantytown_justice.false"}'
                    )
                    UNION
                    (
                        SELECT user_id AS fk_user, 'create_and_close_shantytown' AS fk_option
                        FROM (
                            SELECT u.user_id, ARRAY_AGG(uap.fk_feature || '.' || uap.fk_entity || '.' || uap.allowed || '.' || uap.fk_geographic_level) AS permissions
                            FROM user_actual_permissions uap
                            LEFT JOIN users u ON u.user_id = uap.user_id
                            LEFT JOIN organizations o ON u.fk_organization = o.organization_id
                            LEFT JOIN organization_types ot ON o.fk_type = ot.organization_type_id
                            WHERE uap.fk_organization IS NOT NULL AND ot.fk_role = 'association'
                            GROUP BY u.user_id
                        ) t
                        WHERE permissions @> '{"close.shantytown.true.local","create.shantytown.true.local"}'
                    )
                ) t2`,
            {
                type: queryInterface.sequelize.QueryTypes.SELECT,
                transaction,
            },
        )
            .then(rows => queryInterface.bulkInsert(
                'user_permission_options',
                rows,
                {
                    transaction,
                },
            )),
    ),

    down: queryInterface => queryInterface.sequelize.query('DELETE FROM user_permission_options'),

};
