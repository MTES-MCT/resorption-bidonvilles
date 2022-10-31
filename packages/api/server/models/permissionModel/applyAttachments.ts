import addAttachments from './addAttachments';

export default attachments => ({
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
