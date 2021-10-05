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
            fk_organization AS organization,
            fk_role_admin AS role_admin,
            fk_role_regular AS role_regular,
            fk_entity AS entity,
            fk_feature AS feature,
            allowed,
            fk_geographic_level AS geographic_level
        FROM permissions
        WHERE fk_entity = :entity ${where.length > 0 ? `AND (${where.join(' OR ')})` : ''}
        ORDER BY role_admin ASC, role_regular ASC, organization ASC, feature ASC
    `, {
        type: sequelize.QueryTypes.SELECT,
        replacements: {
            ...replacements,
            entity,
        },
    });
};
