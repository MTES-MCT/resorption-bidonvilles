import { Transaction } from 'sequelize';
import applyAttachments from '#server/models/permissionModel/applyAttachments';
import { Attachment } from '#server/models/permissionModel/types/Attachment.d';

export default async (actionId: number, users: number[], transaction: Transaction): Promise<void> => {
    const attachment: Attachment[] = [{ type: 'action', id: actionId }];

    const uniqueUsers = new Set(users);

    await Promise.all(
        Array.from(uniqueUsers).map(userId => [
            applyAttachments(attachment).toUser(userId).onFeature('read', 'action', transaction),
            applyAttachments(attachment).toUser(userId).onFeature('read', 'action_comment', transaction),
            applyAttachments(attachment).toUser(userId).onFeature('update', 'action', transaction),
            applyAttachments(attachment).toUser(userId).onFeature('create', 'action_comment', transaction),
        ]).flat(),
    );
};
