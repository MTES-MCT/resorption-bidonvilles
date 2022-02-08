const getUserRelatedPermission = require('./getUserRelatedPermission');
const getOrganizationRelatedPermission = require('./getOrganizationRelatedPermission');

module.exports = (feature, entity) => ({
    ofUser(userId, transaction = undefined) {
        return getUserRelatedPermission(
            feature,
            entity,
            userId,
            transaction,
        );
    },
    ofOrganization(organizationId, transaction = undefined) {
        return getOrganizationRelatedPermission(
            feature,
            entity,
            organizationId,
            transaction,
        );
    },
});
