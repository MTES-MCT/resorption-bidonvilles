import { sequelize } from '#db/sequelize';
import { Transaction } from 'sequelize';
import { Attachment } from './types/Attachment';
import getUserPermission from './_common/getUserPermission';

async function removeAttachments(attachments, feature, entity, userId = null, organizationId = null, transaction = undefined) {
    let permission;
    if (userId !== null) {
        [permission] = await getUserPermission(feature, entity).ofUser(userId, transaction);
    } else {
        [permission] = await getUserPermission(feature, entity).ofOrganization(organizationId, transaction);
    }

    if (permission === null || permission.allowed === false || permission.allow_all === true) {
        return;
    }

    const where = attachments.map(attachment => `fk_${attachment.type} = ?`).join(' OR ');
    await sequelize.query(
        `DELETE FROM user_permission_attachments WHERE fk_user_permission = ? AND ${where}`,
        {
            transaction,
            replacements: [
                permission.user_permission_id,
                ...attachments.map(({ id }) => id),
            ],
        },
    );
}

export default (attachments: Attachment[]) => ({
    fromUser: (userId: number) => ({
        onFeature(feature: string, entity: string, transaction: Transaction = undefined) {
            return removeAttachments(attachments, feature, entity, userId, null, transaction);
        },
    }),

    fromOrganization: (organizationId: number) => ({
        onFeature(feature: string, entity: string, transaction: Transaction = undefined) {
            return removeAttachments(attachments, feature, entity, null, organizationId, transaction);
        },
    }),
});