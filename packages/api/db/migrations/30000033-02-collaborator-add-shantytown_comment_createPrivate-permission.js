module.exports = {
    up: queryInterface => queryInterface.sequelize.query(
        `INSERT INTO role_permissions
            (fk_role_regular, fk_entity, fk_feature, allowed, allow_all) 
        VALUES
            ('collaborator', 'shantytown_comment', 'createPrivate', true, false)`,
    ),

    down: queryInterface => queryInterface.sequelize.query(
        `DELETE FROM permissions 
             WHERE
               fk_role_regular = 'collaborator'
               AND fk_entity = 'shantytown_comment'
               AND fk_feature = 'createPrivate';`,
    ),

};
