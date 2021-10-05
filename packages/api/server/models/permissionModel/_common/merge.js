/**
 * Processes and merges the given rows into the given permission map
 *
 * @param {PermissionMap} argPermissions
 * @param {Array}         rows
 *
 * @returns {PermissionMap}
 */
module.exports = (argPermissions, rows) => {
    const permissions = Object.assign({}, argPermissions);

    rows.forEach((row) => {
        // build the permission object
        const permission = {
            allowed: row.allowed,
            geographic_level: row.geographic_level,
        };

        // merge it to the permissions object
        let ownerId;
        let ownerType;
        if (row.organization !== null) {
            ownerId = row.organization;
            ownerType = 'organizations';
        } else if (row.role_admin !== null) {
            ownerId = row.role_admin;
            ownerType = 'roles_admin';
        } else if (row.role_regular !== null) {
            ownerId = row.role_regular;
            ownerType = 'roles_regular';
        }

        if (!Object.prototype.hasOwnProperty.call(permissions[ownerType], ownerId)) {
            permissions[ownerType][ownerId] = {};
        }

        if (!Object.prototype.hasOwnProperty.call(permissions[ownerType][ownerId], row.entity)) {
            permissions[ownerType][ownerId][row.entity] = {};
        }

        // if (Object.prototype.hasOwnProperty.call(permissions[ownerType][ownerId][row.entity], row.feature)) {
        // @TODO: we should throw an exception here
        // }

        permissions[ownerType][ownerId][row.entity][row.feature] = permission;
    });

    return permissions;
};
