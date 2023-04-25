import { Transaction } from 'sequelize';
import applyAttachments from '#server/models/permissionModel/applyAttachments';
import { Attachment } from '#server/models/permissionModel/types/Attachment.d';

export default async (actionId: number, managers: number[], operators: number[], transaction: Transaction): Promise<void> => {
    const attachment: Attachment[] = [{ type: 'action', id: actionId }];

    const uniqueOrganizations = new Set([...managers, ...operators]);
    const uniqueManagers = new Set([...managers]);

    await Promise.all([
        ...Array.from(uniqueOrganizations).map(organizationId => [
            applyAttachments(attachment).toOrganization(organizationId).onFeature('read', 'action', transaction),
            applyAttachments(attachment).toOrganization(organizationId).onFeature('read', 'action_comment', transaction),
            applyAttachments(attachment).toOrganization(organizationId).onFeature('update', 'action', transaction),
            applyAttachments(attachment).toOrganization(organizationId).onFeature('create', 'action_comment', transaction),
        ]).flat(),
        ...Array.from(uniqueManagers).map(
            organizationId => applyAttachments(attachment).toOrganization(organizationId).onFeature('access', 'action_finances', transaction),
        ),
    ]);
};
