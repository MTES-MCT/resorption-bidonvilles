module.exports = {

    up: queryInterface => queryInterface.sequelize.query(
        `INSERT INTO role_permissions(fk_role_regular, fk_feature, fk_entity, allowed, allow_all) VALUES 
                (
                    'intervener',
                    'export',
                    'shantytown',
                    true,
                    false
                )`,
    ),

    down: queryInterface => queryInterface.sequelize.query(
        `DELETE FROM role_permissions 
        WHERE
            fk_role_regular = 'intervener' 
        AND
            fk_feature = 'export'
        AND
            fk_entity = 'shantytown'`,
    ),
};
