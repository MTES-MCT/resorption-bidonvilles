import permissionUtils from '#server/utils/permission';
import shantytownParcelOwner from '#server/models/shantytownParcelOwnerModel';
import ServiceError from '#server/errors/ServiceError';
import { AuthUser } from '#server/middlewares/authMiddleware';
import { Shantytown } from '#root/types/resources/Shantytown.d';
import { RawParcelOwner } from '#root/types/resources/ParcelOwner.d';

export default async (user: AuthUser, shantytown: Shantytown): Promise<RawParcelOwner> => {
    if (!permissionUtils.can(user).do('access', 'shantytown_owner').on(shantytown)) {
        throw new ServiceError('permission_denied', new Error('Vous n\'avez pas la permission de lire les propriétaires de parcelles'));
    }

    let parcelOwners: RawParcelOwner;
    try {
        parcelOwners = await shantytownParcelOwner.findAll(user, shantytown.id);

        if (!parcelOwners) {
            throw new Error('Aucun propriétaire de parcelle trouvé pour ce bidonville');
        }
    } catch (error) {
        throw new ServiceError('parcel_owner_fetch_failed', new Error(error?.message));
    }

    return parcelOwners;
};
