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

    // If the user has nation permissions, don't restrict results
    if (permissions[permission].geographic_level === 'nation' || userLocation.type === 'nation') {
        return whereFn(requestedLocation);
    }

    // if the user has local permissions
    if (requestedLocation.type === 'nation') {
        return whereFn(userLocation);
    }

    // if requestedLocation.type < userLocation.type (ex: departement < region)
    if (requestedLocation[userLocation.type]) {
        // if userLocation includes requestedLocation allow the requestedLocation
        // (ex: Île-de-France includes Yvelines)
        if (requestedLocation[userLocation.type].code === userLocation[userLocation.type].code) {
            return whereFn(requestedLocation);
        }

        // if not, return null
        // (ex: Île-de-France does not include Calvados)
        return whereFn(null);
    }

    // if userLocation.type < requestedLocation.type (ex: departement < region)
    // and requestedLocation includes userLocation
    // allow userLocation
    // (ex: requested is Ile-de-france, but user's location is Yvelines, return Yvelines)
    if (userLocation[requestedLocation.type].code === requestedLocation[requestedLocation.type].code) {
        return whereFn(userLocation);
    }

    // otherwise: null
    return whereFn(null);
};
