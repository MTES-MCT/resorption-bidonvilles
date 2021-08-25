/**
 * @param {HistoryPermissions} permissions See above
 * @param {String} permission shantytown.list
 * @param {Object} requestedLocation Location requested
 * @param {Object} userLocation
 */
module.exports = ({
    permissions, permission, requestedLocation, userLocation, whereFn,
}) => {
    // If the user has no permissions, return null
    if (!permissions[permission]) {
        return whereFn(null);
    }

    // If the user request nation and has nation permissions, don't restrict results
    if (requestedLocation.type === 'nation' && permissions[permission].geographic_level === 'nation') {
        return whereFn(requestedLocation);
    }

    return whereFn(userLocation);
};
