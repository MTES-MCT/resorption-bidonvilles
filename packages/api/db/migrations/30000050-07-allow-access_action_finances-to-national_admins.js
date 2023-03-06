module.exports = {
    up(queryInterface) {
        return queryInterface.sequelize.query(
            `INSERT INTO role_permissions (fk_role_admin, fk_role_regular, fk_feature, fk_entity, allowed,allow_all)
                 VALUES ('national_admin', NULL, 'access', 'action_finances', true, true),
                 (NULL, 'direct_collaborator', 'access', 'action_finances', true, false),
                 ('local_admin', NULL, 'access', 'action_finances', true, false)`,
        );
    },

    down(queryInterface) {
        return queryInterface.sequelize.query(
            `DELETE FROM role_permissions WHERE (fk_role_admin IN ('national_admin', 'local_admin') 
             OR fk_role_regular = 'direct_collaborator')
             AND fk_feature = 'access' AND fk_entity = 'action_finances'`,
        );
    },
};
