/**
 * Merges organization's permissions into role's permissions
 *
 * @param {Permissions} rolePermissions
 * @param {Permissions} orgPermissions
 *
 * @returns {Permissions}
 */
function mergePermissions(rolePermissions, orgPermissions) {
    const permissions = Object.assign({}, rolePermissions);

    Object.keys(orgPermissions).forEach((entity) => {
        Object.assign(permissions[entity] || {}, orgPermissions[entity] || {});
    });

    return permissions;
}

/**
 * Gets the proper list of permissions for the given user
 *
 * @param {Object}        user
 * @param {PermissionMap} permissionMap
 *
 * @returns {Permissions}
 */
function getPermissionsFor(user, permissionMap) {
    if (user.is_admin === true) {
        return permissionMap.roles_admin[user.role] || {};
    }

    return mergePermissions(
        permissionMap.roles_regular[user.organization_type_role] || {},
        permissionMap.organizations[user.organization_id] || {},
    );
}

module.exports = {
    getPermissionsFor,
};
