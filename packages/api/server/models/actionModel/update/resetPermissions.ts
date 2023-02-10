import { QueryTypes, Transaction } from 'sequelize';
import { sequelize } from '#db/sequelize';
import removeAttachments from '#server/models/permissionModel/removeAttachments';
import { Attachment } from '#server/models/permissionModel/types/Attachment.d';

type UserRow = {
    fk_user: number
};

export default async (id: number, transaction: Transaction): Promise<void> => {
    const attachment: Attachment[] = [{ type: 'action', id }];
    const users: UserRow[] = await sequelize.query(
        `SELECT fk_user FROM action_operators WHERE fk_action = :actionId
        UNION
        SELECT fk_user FROM action_managers WHERE fk_action = :actionId`,
        {
            type: QueryTypes.SELECT,
            replacements: {
                actionId: id,
            },
            transaction,
        },
    );

    await Promise.all([
        users.map(({ fk_user: userId }) => [
            removeAttachments(attachment).fromUser(userId).onFeature('read', 'action', transaction),
            removeAttachments(attachment).fromUser(userId).onFeature('read', 'action_comment', transaction),
            removeAttachments(attachment).fromUser(userId).onFeature('update', 'action', transaction),
            removeAttachments(attachment).fromUser(userId).onFeature('create', 'action_comment', transaction),
        ]).flat(),
    ]);
};
