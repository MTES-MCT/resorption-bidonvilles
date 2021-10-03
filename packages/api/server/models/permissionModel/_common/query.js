const merge = require('./merge');
const subquery = require('./subquery');
const fetchEntities = require('./fetchEntities');

/**
 * Queries permissions from the database
 *
 * @param {PermissionOwners} [owners]
 *
 * @returns {PermissionMap}
 */
module.exports = async (owners = {}) => {
    const entities = await fetchEntities();

    let permissions = {
        organizations: {},
        roles_admin: {},
        roles_regular: {},
    };

    for (let i = 0; i < entities.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        permissions = merge(permissions, await subquery(entities[i], owners));
    }

    return permissions;
};
