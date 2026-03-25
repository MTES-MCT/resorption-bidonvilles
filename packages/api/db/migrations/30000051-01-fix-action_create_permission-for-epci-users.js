const refreshViewCascade = require('./common/refreshViewCascade');
const createUserActualPermissions = require('./common/user_actual_permissions/10_reset');
const createUserPermissionsByOption = require('./common/user_permissions_by_option/03_reset');
const createFullUserPermissionsByUser = require('./common/full_user_permissions_by_user/01_initial_view');
const createFullUserPermissionsByOrganization = require('./common/full_user_permissions_by_organization/01_initial_view');
const createUserPermissionsWithAttachments = require('./common/user_permissions_with_attachments/02_remove-is_cumulative');
const createOldUserPermissionsByRole = require('./common/full_user_permissions_by_role/01_initial_view');
const createNewUserPermissionsByRole = require('./common/full_user_permissions_by_role/02_fix_action_create');

module.exports = refreshViewCascade([
    {
        name: 'user_actual_permissions',
        oldView: createUserActualPermissions,
        newView: createUserActualPermissions,
    },
    {
        name: 'user_permissions_by_option',
        oldView: createUserPermissionsByOption,
        newView: createUserPermissionsByOption,
    },
    {
        name: 'full_user_permissions_by_user',
        oldView: createFullUserPermissionsByUser,
        newView: createFullUserPermissionsByUser,
    },
    {
        name: 'full_user_permissions_by_organization',
        oldView: createFullUserPermissionsByOrganization,
        newView: createFullUserPermissionsByOrganization,
    },
    {
        name: 'user_permissions_with_attachments',
        oldView: createUserPermissionsWithAttachments,
        newView: createUserPermissionsWithAttachments,
    },
    {
        name: 'full_user_permissions_by_role',
        oldView: createOldUserPermissionsByRole,
        newView: createNewUserPermissionsByRole,
    },
]);
