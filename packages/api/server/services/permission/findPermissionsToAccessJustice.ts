import permissionModel from '#server/models/permissionModel';
import ServiceError from '#server/errors/ServiceError';

export default async (shantytownId: number) => {
    let usersWhoCanAccessJustice = [];
    try {
        usersWhoCanAccessJustice = await permissionModel.findPermissionsToAccessJustice(shantytownId);
        if (usersWhoCanAccessJustice.length > 0) {
            return usersWhoCanAccessJustice;
        }
        return [];
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }
};
