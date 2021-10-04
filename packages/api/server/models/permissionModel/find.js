const query = require('./_common/query');

/**
 * Returns a permission map for the requested owners only
 *
 * @param {PermissionOwners} owners
 *
 * @returns {PermissionMap}
 */
module.exports = owners => query(owners);
