// actions
module.exports = {
    up: queryInterface => queryInterface.sequelize.query(
        `INSERT INTO role_permissions
            (fk_role_regular, fk_role_admin, fk_feature, fk_entity, allowed, allow_all)
            VALUES
            ('association', null, 'read', 'action', true, false),
            ('association', null, 'create', 'action', true, false),
            ('association', null, 'read', 'action_comment', true, false),

            ('collaborator', null, 'read', 'action', true, false),
            ('collaborator', null, 'create', 'action', true, false),
            ('collaborator', null, 'read', 'action_comment', true, false),

            ('direct_collaborator', null, 'read', 'action', true, false),
            ('direct_collaborator', null, 'create', 'action', true, false),
            ('direct_collaborator', null, 'read', 'action_comment', true, false),

            ('external_observator', null, 'read', 'action', true, false),
            ('external_observator', null, 'read', 'action_comment', true, false),

            ('intervener', null, 'read', 'action', true, false),
            ('intervener', null, 'create', 'action', true, false),
            ('intervener', null, 'read', 'action_comment', true, false),

            ('national_establisment', null, 'read', 'action', true, false),
            ('national_establisment', null, 'create', 'action', true, false),
            ('national_establisment', null, 'read', 'action_comment', true, false),

            (null, 'local_admin', 'read', 'action', true, true),
            (null, 'local_admin', 'create', 'action', true, false),
            (null, 'local_admin', 'update', 'action', true, false),
            (null, 'local_admin', 'read', 'action_comment', true, true),
            (null, 'local_admin', 'create', 'action_comment', true, false),

            (null, 'national_admin', 'read', 'action', true, true),
            (null, 'national_admin', 'create', 'action', true, true),
            (null, 'national_admin', 'update', 'action', true, true),
            (null, 'national_admin', 'export', 'action', true, true),
            (null, 'national_admin', 'read', 'action_comment', true, true),
            (null, 'national_admin', 'export', 'action_comment', true, true),
            (null, 'national_admin', 'create', 'action_comment', true, true)`,
        {
            type: queryInterface.sequelize.QueryTypes.INSERT,
        },
    ),

    down: queryInterface => queryInterface.sequelize.query(
        'DELETE FROM role_permissions WHERE fk_entity IN (\'action\', \'action_comment\')',
    ),
};
