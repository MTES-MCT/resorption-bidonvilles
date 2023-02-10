import { Transaction } from 'sequelize';
import addAttachments from './addAttachments';
import { Attachment } from './types/Attachment.d';

export default (attachments: Attachment[]) => ({
    toUser: (userId: number) => ({
        onFeature(feature: string, entity: string, transaction: Transaction = undefined) {
            return addAttachments(
                attachments,
                { type: 'User', id: userId },
                feature,
                entity,
                transaction,
            );
        },
    }),

    toOrganization: (organizationId: number) => ({
        onFeature(feature: string, entity: string, transaction: Transaction = undefined) {
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
