import getUserRelatedPermission from './getUserRelatedPermission';
import getOrganizationRelatedPermission from './getOrganizationRelatedPermission';

export default (feature, entity) => ({
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
