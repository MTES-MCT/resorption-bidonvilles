module.exports = {
    up: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            'INSERT INTO permissions(fk_role_regular, fk_entity, fk_feature, allowed, fk_geographic_level) VALUES (\'direct_collaborator\', \'shantytown_comment\', \'listPrivate\', true, \'local\')',
            {
                transaction,
            },
        ),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.sequelize.query(
            `DELETE FROM permissions 
             WHERE
               fk_role_regular = 'direct_collaborator'
               AND fk_entity = 'shantytown_comment'
               AND fk_feature = 'listPrivate';`,
            {
                transaction,
            },
        ),
    ),

};
