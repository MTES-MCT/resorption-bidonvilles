const getUserPermission = require('./_common/getUserPermission');
const updateUserPermission = require('./_common/updateUserPermission');
const insertUserPermission = require('./_common/insertUserPermission');
const insertAttachments = require('./_common/insertAttachments');

async function addAttachments(attachments, user, feature, entity, transaction = undefined) {
    const [userPermission, defaultPermission] = await getUserPermission(feature, entity)[`of${user.type}`](user.id, transaction);

    let userPermissionId;
    if (userPermission !== null) {
        if (userPermission.allow_all === true) {
            return;
        }

        userPermissionId = userPermission.user_permission_id;

        if (userPermission.allowed === false) {
            await updateUserPermission(userPermissionId, { allowed: true, allow_all: false, is_cumulative: false }, transaction);
        }
    } else {
        let is_cumulative = false;
        if (defaultPermission !== null) {
            if (defaultPermission.allow_all === true) {
                return;
            }

            is_cumulative = defaultPermission.allowed;
        }

        userPermissionId = await insertUserPermission({
            feature,
            entity,
            fk_user: user.type === 'User' ? user.id : null,
            fk_organization: user.type === 'Organization' ? user.id : null,
            allowed: true,
            allow_all: false,
            is_cumulative,
        }, transaction);
    }

    await insertAttachments(attachments, userPermissionId, transaction);
}

module.exports = attachments => ({
    toUser: userId => ({
        onFeature(feature, entity, transaction = undefined) {
            return addAttachments(
                attachments,
                { type: 'User', id: userId },
                feature,
                entity,
                transaction,
            );
        },
    }),

    toOrganization: organizationId => ({
        onFeature(feature, entity, transaction = undefined) {
            return addAttachments(
                attachments,
                { type: 'Organization', id: organizationId },
                feature,
                entity,
                transaction,
            );
        },
    }),
});
