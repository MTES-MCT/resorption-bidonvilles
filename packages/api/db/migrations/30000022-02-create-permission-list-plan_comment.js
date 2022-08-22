module.exports = {
    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            'INSERT INTO entities(name) VALUES(\'plan_comment\')',
            {
                transaction,
            },
        )
            .then(() => queryInterface.sequelize.query(
                'INSERT INTO features(name, fk_entity, is_writing) VALUES(\'create\', \'plan_comment\', false)',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.sequelize.query(
                'INSERT INTO features(name, fk_entity, is_writing) VALUES(\'list\', \'plan_comment\', false)',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.sequelize.query(
                `INSERT INTO role_permissions(fk_role_regular, fk_feature, fk_entity, allowed, allow_all)
                VALUES 
                    ('association', 'list', 'plan_comment', true, false),
                    ('association', 'create', 'plan_comment', true, false),
                    ('collaborator', 'list', 'plan_comment', true, false),
                    ('collaborator', 'create', 'plan_comment', true, false),
                    ('direct_collaborator', 'list', 'plan_comment', true, false),
                    ('direct_collaborator', 'create', 'plan_comment', true, false),
                    ('external_observator', 'list', 'plan_comment', true, false),
                    ('intervener', 'list', 'plan_comment', true, false),
                    ('intervener', 'create', 'plan_comment', true, false),
                    ('national_establisment', 'list', 'plan_comment', true, false),
                    ('national_establisment', 'create', 'plan_comment', true, false)
                    `,
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.sequelize.query(
                `INSERT INTO role_permissions(fk_role_admin, fk_feature, fk_entity, allowed, allow_all)
                VALUES
                    ('national_admin', 'list', 'plan_comment', true, true),
                    ('national_admin', 'create', 'plan_comment', true, true),
                    ('local_admin', 'list', 'plan_comment', true, false),
                    ('local_admin', 'create', 'plan_comment', true, false)`,
                {
                    transaction,
                },
            )),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            'DELETE FROM role_permissions WHERE fk_entity = \'plan_comment\'',
            {
                transaction,
            },
        )
            .then(() => queryInterface.sequelize.query(
                'DELETE FROM features WHERE fk_entity = \'plan_comment\'',
                {
                    transaction,
                },
            ))
            .then(() => queryInterface.sequelize.query(
                'DELETE FROM entities WHERE name = \'plan_comment\'',
                {
                    transaction,
                },
            )),
    ),

};
