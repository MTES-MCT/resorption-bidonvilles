module.exports = {
    up(queryInterface) {
        return queryInterface.sequelize.query(
            'DELETE FROM role_permissions WHERE fk_role_regular = \'direct_collaborator\' AND fk_feature = \'listPrivate\' AND fk_entity = \'shantytown_comment\'',
        );
    },

    down(queryInterface) {
        return queryInterface.sequelize.query(
            `INSERT INTO role_permissions(fk_role_regular, fk_feature, fk_entity, allowed, allow_all)
            VALUES('direct_collaborator', 'listPrivate', 'shantytown_comment', true, false)`,
        );
    },

};
