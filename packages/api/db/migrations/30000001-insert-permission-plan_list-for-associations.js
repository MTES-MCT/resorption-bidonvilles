module.exports = {
    up(queryInterface) {
        return queryInterface.sequelize.query(
            `INSERT INTO role_permissions(fk_role_regular, fk_feature, fk_entity, allowed, allow_all)
            VALUES('association', 'list', 'plan', true, false)`,
        );
    },

    down(queryInterface) {
        return queryInterface.sequelize.query(
            'DELETE FROM role_permissions WHERE fk_role_regular = \'association\' AND fk_feature = \'list\' AND fk_entity = \'plan\'',
        );
    },

};
