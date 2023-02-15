import { QueryTypes, Transaction } from 'sequelize';
import { sequelize } from '#db/sequelize';
import removeAttachments from '#server/models/permissionModel/removeAttachments';
import { Attachment } from '#server/models/permissionModel/types/Attachment.d';

type OrganizationRow = {
    fk_organization: number
};

export default async (id: number, transaction: Transaction): Promise<void> => {
    const attachment: Attachment[] = [{ type: 'action', id }];
    const organizations: OrganizationRow[] = await sequelize.query(
        `SELECT DISTINCT users.fk_organization FROM (
            SELECT fk_user FROM action_operators WHERE fk_action = :actionId
            UNION
            SELECT fk_user FROM action_managers WHERE fk_action = :actionId
        ) t
        LEFT JOIN users ON t.fk_user = users.user_id`,
        {
            type: QueryTypes.SELECT,
            replacements: {
                actionId: id,
            },
            transaction,
        },
    );

    await Promise.all([
        organizations.map(({ fk_organization: organizationId }) => [
            removeAttachments(attachment).fromOrganization(organizationId).onFeature('read', 'action', transaction),
            removeAttachments(attachment).fromOrganization(organizationId).onFeature('read', 'action_comment', transaction),
            removeAttachments(attachment).fromOrganization(organizationId).onFeature('update', 'action', transaction),
            removeAttachments(attachment).fromOrganization(organizationId).onFeature('create', 'action_comment', transaction),
        ]).flat(),
    ]);
};
