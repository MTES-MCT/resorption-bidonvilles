// Accorder la permission d'export des actions aux opérateurs et correspondants sur leur territoire
module.exports = {
    up: queryInterface => queryInterface.sequelize.query(
        `INSERT INTO role_permissions
            (fk_role_regular, fk_role_admin, fk_feature, fk_entity, allowed, allow_all)
            VALUES
            -- Opérateurs : export des actions sur leur territoire
            ('association', null, 'export', 'action', true, false),
            
            -- Correspondants : export des actions sur leur territoire
            -- (ils ont déjà accès en lecture nationale, mais l'export reste territorial)
            ('direct_collaborator', null, 'export', 'action', true, false)`,
        {
            type: queryInterface.sequelize.QueryTypes.INSERT,
        },
    ),

    down: queryInterface => queryInterface.sequelize.query(
        `DELETE FROM role_permissions 
         WHERE fk_feature = 'export' 
         AND fk_entity = 'action' 
         AND fk_role_regular IN ('association', 'direct_collaborator')`,
    ),
};
