module.exports = {
    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            `INSERT INTO permissions(fk_role_regular, fk_feature, fk_entity, allowed, fk_geographic_level)
            VALUES('national_establisment', 'read', 'stats', true, 'local')
            RETURNING permission_id`,
            {
                transaction,
            },
        )
            .then(([[{ permission_id }]]) => queryInterface.sequelize.query(
                'INSERT INTO stats_permissions(fk_permission) VALUES(:permission_id)',
                {
                    replacements: {
                        permission_id,
                    },
                    transaction,
                },
            )),
    ),

    down: queryInterface => queryInterface.sequelize.query(
        'DELETE FROM permissions WHERE fk_role_regular = \'national_establisment\' AND fk_feature = \'read\' AND fk_entity = \'stats\'',
    ),
};
