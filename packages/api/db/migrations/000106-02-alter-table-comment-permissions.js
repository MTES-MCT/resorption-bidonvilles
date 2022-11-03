const adminRoleFeatures = ['listPrivate', 'createPrivate'];
const regularRoleFeatures = ['list', 'create'];
const adminRoles = ['national_admin', 'local_admin'];
const regularRoles = ['association', 'collaborator', 'direct_collaborator', 'national_establisment'];


module.exports = {
    up: (queryInterface) => {
        const insertPermission = (type_role, role, permission) => queryInterface.sequelize.query(
            `INSERT INTO permissions(${type_role}, fk_feature, fk_entity, allowed, fk_geographic_level) VALUES ('${role}', '${permission}', 'shantytown_comment', 'TRUE', 'local') RETURNING permission_id`,
        ).then(([[{ permission_id }]]) => queryInterface.sequelize.query(`INSERT INTO shantytown_comment_permissions(fk_permission) VALUES (${permission_id})`));

        const featuresToCreate = Promise.all(adminRoleFeatures.map(feature => queryInterface.sequelize.query(`INSERT INTO features(name, fk_entity) VALUES ('${feature}', 'shantytown_comment')`)));
        const permissionsRegularRoleToInsert = Promise.all(regularRoles.flatMap(role => regularRoleFeatures.flatMap(permission => insertPermission('fk_role_regular', role, permission))));
        const permissionsAdminRoleToInsert = Promise.all(adminRoles.flatMap(role => adminRoleFeatures.flatMap(permission => insertPermission('fk_role_admin', role, permission))));

        return featuresToCreate.then(() => Promise.all([
            permissionsRegularRoleToInsert,
            permissionsAdminRoleToInsert,

        ]));
    },

    down: queryInterface => Promise.all([
        queryInterface.sequelize.query(`DELETE FROM permissions where fk_entity = 'shantytown_comment' and fk_feature in (${regularRoleFeatures.map(r => `'${r}'`).join(',')}) and fk_role_regular in (${regularRoles.map(r => `'${r}'`).join(',')})`),
        queryInterface.sequelize.query(`DELETE FROM permissions where fk_entity = 'shantytown_comment' and fk_feature in (${adminRoleFeatures.map(r => `'${r}'`).join(',')}) and fk_role_admin in (${adminRoles.map(r => `'${r}'`).join(',')})`),
    ]).then(() => {
        queryInterface.sequelize.query(`DELETE FROM features where name in (${adminRoleFeatures.map(r => `'${r}'`).join(',')}) and fk_entity = 'shantytown_comment'`);
    }),

};
