import { Transaction } from 'sequelize';
import shantytownParcelOwner from '#server/models/shantytownParcelOwnerModel';
import ServiceError from '#server/errors/ServiceError';
import { sequelize } from '#db/sequelize';
import { AuthUser } from '#server/middlewares/authMiddleware';
import { ParcelOwnerInsert } from '#root/types/resources/ParcelOwner.d';

export default async (user: AuthUser, shantytownId: number, owners: ParcelOwnerInsert[], argTransaction: Transaction | undefined = undefined): Promise<{ parcelOwnerId: number }> => {
    let transaction: Transaction = argTransaction;
    transaction ??= await sequelize.transaction();

    let parcelOwnerId;
    console.log('User Allowances:', user.isAllowedTo('access', 'shantytown_owner'));

    if (!user.isAllowedTo('access', 'shantytown_owner')) {
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
