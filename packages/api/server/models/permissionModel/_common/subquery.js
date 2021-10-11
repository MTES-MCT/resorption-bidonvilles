const { sequelize } = require('#db/models');

/**
 * Queries permissions for a specific entity from the database
 *
 * @param {String}           entity Entity name
 * @param {PermissionOwners} owners
 *
 * @returns {Array}
 */
module.exports = (entity, owners) => {
    const where = [];
    const replacements = {};
    Object.keys(owners).forEach((ownerType) => {
        if (owners[ownerType].length > 0) {
            replacements[ownerType] = owners[ownerType];
            where.push(`permissions.fk_${ownerType} IN (:${ownerType})`);
        }
    });

    return sequelize.query(`
        SELECT
            permissions.fk_organization AS organization,
            permissions.fk_role_admin AS role_admin,
            permissions.fk_role_regular AS role_regular,
            permissions.fk_entity AS entity,
            permissions.fk_feature AS feature,
            permissions.allowed,
            permissions.fk_geographic_level AS geographic_level,
            ${entity}_permissions.*
        FROM ${entity}_permissions
        LEFT JOIN permissions ON ${entity}_permissions.fk_permission = permissions.permission_id
        ${where.length > 0 ? `WHERE ${where.join(' OR ')}` : ''}
        ORDER BY role_admin ASC, role_regular ASC, organization ASC, feature ASC
    `, {
        type: sequelize.QueryTypes.SELECT,
        replacements,
    });
};
