import permissionUtils from '#server/utils/permission';
import shantytownParcelOwner from '#server/models/shantytownParcelOwnerModel';
import ServiceError from '#server/errors/ServiceError';
import { sequelize } from '#db/sequelize';
import { AuthUser } from '#server/middlewares/authMiddleware';
import { Shantytown } from '#root/types/resources/Shantytown.d';

export default async (user: AuthUser, shantytown: Shantytown, parcelOwnerIds: number[]): Promise<boolean> => {
    const transaction = await sequelize.transaction();

    if (!permissionUtils.can(user).do('delete', 'shantytown_owner').on(shantytown)) {
        throw new ServiceError('permission_denied', new Error('Vous n\'avez pas la permission de supprimer les propriétaires de parcelles'));
    }
    try {
        const result = await shantytownParcelOwner.deleteOwner(shantytown.id, parcelOwnerIds, transaction);
        if (!result) {
            throw new Error('Échec de la suppression du propriétaire de parcelle');
        }
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw new ServiceError('parcel_owner_deletion_failed', new Error(error?.message));
    }
    return true;
};
