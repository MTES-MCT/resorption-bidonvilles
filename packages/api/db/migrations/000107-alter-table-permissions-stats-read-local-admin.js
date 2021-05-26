module.exports = {
    up: queryInterface => queryInterface.sequelize.query(
        'INSERT INTO permissions(fk_role_admin, fk_feature, fk_entity, allowed, fk_geographic_level) VALUES (\'local_admin\', \'read\', \'stats\', true, \'local\') RETURNING permission_id',
    )
        .then(([[{ permission_id }]]) => queryInterface.sequelize.query(`INSERT INTO stats_permissions(fk_permission) VALUES (${permission_id})`)),


    down: queryInterface => queryInterface.sequelize.query('DELETE FROM permissions where fk_entity = \'stats\' and fk_feature = \'read\' and fk_role_admin = \'local_admin\''),

};
