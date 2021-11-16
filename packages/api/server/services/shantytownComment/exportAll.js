const shantytownCommentModel = require('#server/models/shantytownCommentModel')();
const ServiceError = require('#server/errors/ServiceError');

module.exports = async (user) => {
    if (!user.permissions || !user.permissions.shantytown_comment || !user.permissions.shantytown_comment.export) {
        return [];
    }

    const { allowed, geographic_level: geographicLevel } = user.permissions.shantytown_comment.export;
    const accessPrivatePermission = user.permissions.shantytown_comment.listPrivate;
    if (!allowed) {
        return [];
    }

    const { organization: { location: userLocation } } = user;
    let location;
    if (geographicLevel === 'nation' || userLocation.type === 'nation') {
        // export all comments
        location = null;
    } else if (userLocation.type === 'region') {
        location = { type: 'region', ...userLocation.region };
    } else {
        location = { type: 'departement', ...userLocation.departement };
    }

    let privateLocation = null;
    if (accessPrivatePermission && accessPrivatePermission.allowed === true) {
        if (accessPrivatePermission.geographic_level === 'nation' || userLocation.type === 'nation') {
            privateLocation = { type: 'nation' };
        } else if (userLocation.type === 'region') {
            privateLocation = { type: 'region', ...userLocation.region };
        } else {
            privateLocation = { type: 'departement', ...userLocation.departement };
        }
    }

    let comments;
    try {
        comments = await shantytownCommentModel.findAll(location, privateLocation);
    } catch (error) {
        throw new ServiceError('select_failed', error);
    }

    return comments;
};
