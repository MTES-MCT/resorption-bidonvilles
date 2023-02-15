import { Transaction } from 'sequelize';
import applyAttachments from '#server/models/permissionModel/applyAttachments';
import { Attachment } from '#server/models/permissionModel/types/Attachment.d';

export default async (actionId: number, organizations: number[], transaction: Transaction): Promise<void> => {
    const attachment: Attachment[] = [{ type: 'action', id: actionId }];

    const uniqueOrganizations = new Set(organizations);

    await Promise.all(
        Array.from(uniqueOrganizations).map(organizationId => [
            applyAttachments(attachment).toOrganization(organizationId).onFeature('read', 'action', transaction),
            applyAttachments(attachment).toOrganization(organizationId).onFeature('read', 'action_comment', transaction),
            applyAttachments(attachment).toOrganization(organizationId).onFeature('update', 'action', transaction),
            applyAttachments(attachment).toOrganization(organizationId).onFeature('create', 'action_comment', transaction),
        ]).flat(),
    );
};
