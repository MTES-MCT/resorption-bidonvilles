const attachmentsObject = require('./addAttachments');

module.exports = attachments => ({
    toUser: userId => ({
        onFeature(feature, entity, transaction = undefined) {
            return attachmentsObject.addAttachments(
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
            return attachmentsObject.addAttachments(
                attachments,
                { type: 'Organization', id: organizationId },
                feature,
                entity,
                transaction,
            );
        },
    }),
});
