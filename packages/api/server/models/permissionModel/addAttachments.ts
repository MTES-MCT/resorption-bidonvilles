import getUserPermission from './_common/getUserPermission';
import updateUserPermission from './_common/updateUserPermission';
import insertUserPermission from './_common/insertUserPermission';
import insertAttachments from './_common/insertAttachments';
import { Attachment } from './types/Attachment.d';

export default async (attachments: Attachment[], user, feature, entity, transaction = undefined) => {
    const [userPermission, defaultPermission] = await getUserPermission(feature, entity)[`of${user.type}`](user.id, transaction);

    let userPermissionId;
    if (userPermission !== null) {
        if (userPermission.allow_all === true) {
            return;
        }

        userPermissionId = userPermission.user_permission_id;

        if (userPermission.allowed === false) {
            await updateUserPermission(userPermissionId, { allowed: true, allow_all: false }, transaction);
        }
    } else {
        if (defaultPermission !== null && defaultPermission.allow_all === true) {
            return;
        }

        userPermissionId = await insertUserPermission({
            feature,
            entity,
            fk_user: user.type === 'User' ? user.id : null,
            fk_organization: user.type === 'Organization' ? user.id : null,
            allowed: true,
            allow_all: false,
        }, transaction);
    }

    await insertAttachments(attachments, userPermissionId, transaction);
};
