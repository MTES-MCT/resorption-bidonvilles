import { QueryTypes, Transaction } from 'sequelize';
import { sequelize } from '#db/sequelize';
import removeAttachments from '#server/models/permissionModel/removeAttachments';
import { Attachment } from '#server/models/permissionModel/types/Attachment.d';

type OrganizationRow = {
    fk_organization: number
};

export default async (id: number, transaction: Transaction): Promise<void> => {
    const attachment: Attachment[] = [{ type: 'action', id }];
    const promises: [Promise<OrganizationRow[]>, Promise<OrganizationRow[]>] = [
        sequelize.query(
            `SELECT DISTINCT users.fk_organization FROM action_operators
            LEFT JOIN users ON action_operators.fk_user = users.user_id
            WHERE fk_action = :actionId`,
            {
                type: QueryTypes.SELECT,
                replacements: {
                    actionId: id,
                },
                transaction,
            },
        ),
        sequelize.query(
            `SELECT DISTINCT users.fk_organization FROM action_managers
            LEFT JOIN users ON action_managers.fk_user = users.user_id
            WHERE fk_action = :actionId`,
            {
                type: QueryTypes.SELECT,
                replacements: {
                    actionId: id,
                },
                transaction,
            },
        ),
    ];
    const [operators, managers] = await Promise.all(promises);

    await Promise.all([
        [...operators, ...managers].map(({ fk_organization: organizationId }) => [
            removeAttachments(attachment).fromOrganization(organizationId).onFeature('read', 'action', transaction),
            removeAttachments(attachment).fromOrganization(organizationId).onFeature('read', 'action_comment', transaction),
            removeAttachments(attachment).fromOrganization(organizationId).onFeature('update', 'action', transaction),
            removeAttachments(attachment).fromOrganization(organizationId).onFeature('create', 'action_comment', transaction),
        ]).flat(),
        managers.map(
            ({ fk_organization: organizationId }) => removeAttachments(attachment).fromOrganization(organizationId).onFeature('access', 'action_finances', transaction),
        ),
    ]);
};
