module.exports = {
    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            'INSERT INTO entities(name) VALUES(\'shantytown_owner\')',
            {
                transaction,
            },
        )
            .then(() => queryInterface.sequelize.query(
                'INSERT INTO features(name, fk_entity) VALUES(\'access\', \'shantytown_owner\')',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.sequelize.query(
                `INSERT INTO permissions(fk_role_regular, fk_role_admin, fk_entity, fk_feature, allowed, fk_geographic_level)
                VALUES
                    (NULL, 'national_admin', 'shantytown_owner', 'access', true, 'nation'),
                    (NULL, 'local_admin', 'shantytown_owner', 'access', true, 'local'),
                    ('direct_collaborator', NULL, 'shantytown_owner', 'access', true, 'local')`,
                {
                    transaction,
                },
            )),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            'DELETE FROM permissions WHERE fk_entity = \'shantytown_owner\' AND fk_feature = \'access\' AND (fk_role_regular = \'direct_collaborator\' OR fk_role_admin IN (\'local_admin\', \'national_admin\'))',
            {
                transaction,
            },
        )
            .then(() => queryInterface.sequelize.query(
                'DELETE FROM features WHERE name = \'access\' AND fk_entity = \'shantytown_owner\'',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.sequelize.query(
                'DELETE FROM entities WHERE name = \'shantytown_owner\'',
                {
                    transaction,
                },
            )),
    ),

};
