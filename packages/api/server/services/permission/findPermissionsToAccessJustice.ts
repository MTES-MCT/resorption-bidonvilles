import permissionModel from '#server/models/permissionModel';
import ServiceError from '#server/errors/ServiceError';

function getUsersWhoCanAccessJustice(location) {
    return permissionModel.findPermissionsToAccessJustice(location);
}

export default async (location) => {
    let usersWhoCanAccessJustice = [];
    try {
        usersWhoCanAccessJustice = await getUsersWhoCanAccessJustice(location);
        if (usersWhoCanAccessJustice.length > 0) {
            return usersWhoCanAccessJustice;
        }
        return [];
    } catch (error) {
        throw new ServiceError('fetch_failed', new Error('Impossible de trouver les permissions d\'accès aux procédures judiciaires en base de données'));
    }
};
