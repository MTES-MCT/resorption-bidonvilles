import permissionUtils from '#server/utils/permission';
import shantytownModel from '#server/models/shantytownModel';
import shantytownParcelOwner from '#server/models/shantytownParcelOwnerModel';
import ServiceError from '#server/errors/ServiceError';
import { sequelize } from '#db/sequelize';
import { AuthUser } from '#server/middlewares/authMiddleware';
import { Location } from '#server/models/geoModel/Location.d';
import { Shantytown } from '#root/types/resources/Shantytown.d';
import { ParcelOwnerInsert } from '#root/types/resources/ParcelOwner.d';

export default async (user: AuthUser, shantytownId: number, owners: ParcelOwnerInsert[]): Promise<{ parcelOwnerId: number }> => {
    const transaction = await sequelize.transaction();

    let parcelOwnerId;
    let shantytown: Shantytown;
    try {
        shantytown = await shantytownModel.findOne(user, shantytownId, null);
    } catch (error) {
        throw new ServiceError('shantytown_unfound', new Error(error?.message));
    }

    const location: Location = {
        type: 'departement',
        region: shantytown.region,
        departement: shantytown.departement,
        epci: null,
        city: null,
    };

    if (!permissionUtils.can(user).do('access', 'shantytown_owner').on(location)) {
        throw new ServiceError('permission_denied', new Error('Vous n\'avez pas la permission de créer un propriétaire de parcelle'));
    }

    try {
        parcelOwnerId = await shantytownParcelOwner.create(user, shantytownId, owners, transaction);
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw new ServiceError('parcel_owner_creation_failed', new Error(error?.message));
    }
    return parcelOwnerId;
};
