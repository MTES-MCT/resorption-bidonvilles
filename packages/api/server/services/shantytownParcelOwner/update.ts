import { Transaction } from 'sequelize';
import shantytownParcelOwner from '#server/models/shantytownParcelOwnerModel';
import ServiceError from '#server/errors/ServiceError';
import { sequelize } from '#db/sequelize';
import { AuthUser } from '#server/middlewares/authMiddleware';
import { Shantytown } from '#root/types/resources/Shantytown.d';
import { ParcelOwnerInsert, RawParcelOwner } from '#root/types/resources/ParcelOwner.d';

export default async (user: AuthUser, shantytown: Shantytown, owners: ParcelOwnerInsert[], argTransaction: Transaction | undefined = undefined): Promise<void> => {
    let transaction: Transaction = argTransaction;
    transaction ??= await sequelize.transaction();
        const hasName = owner.name && owner.name.trim() !== '';

    // On récupère les propriétaires existants pour le site
    let actualOwners: RawParcelOwner[] = [];
    try {
        actualOwners = await shantytownParcelOwner.findAll(user, shantytown.id, transaction);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Erreur lors de la récupération des propriétaires existants :', error);
        throw new ServiceError('parcel_owner_fetch_failed', new Error('Erreur lors de la récupération des propriétaires existants'));
    }

    // Ne considérer que les propriétaires actifs
    const activeOwners = actualOwners.filter(o => o.active);
    const oldOwnerIds = activeOwners?.map(o => o.shantytown_parcel_owner_id);

    // Propriétaires à CRÉER
    const ownersToCreate: ParcelOwnerInsert[] = validOwners.filter(o => o.ownerId === null || o.ownerId === undefined);

    // Propriétaires à METTRE À JOUR
    const ownersToUpdate: ParcelOwnerInsert[] = validOwners.filter(o => o.ownerId !== null
        && o.ownerId !== undefined
        && oldOwnerIds.includes(o.ownerId));

    // Propriétaires à DÉSACTIVER (uniquement parmi les actifs)
    const newOwnerIds = validOwners.map(o => o.ownerId);
    const ownersToSoftDelete = activeOwners
        .filter(oldOwner => !newOwnerIds.includes(oldOwner.shantytown_parcel_owner_id))
        .map(oldOwner => ({
            ownerId: oldOwner.shantytown_parcel_owner_id,
            name: oldOwner.owner_name,
            type: oldOwner.fk_owner_type,
            active: false,
        }));

    // On combine les updates et désactivation
    const allOwnersForUpdate: ParcelOwnerInsert[] = [...ownersToUpdate, ...ownersToSoftDelete];

    try {
    // On commence par la modification des propriétaires existants
        if (allOwnersForUpdate.length > 0) {
            try {
                await shantytownParcelOwner.update(allOwnersForUpdate, transaction);
            } catch (error) {
                throw new ServiceError('parcel_owner_update_failed', new Error(error?.message));
            }
        }

        // On ajoute les nouveaux propriétaires
        if (ownersToCreate.length > 0) {
            try {
                await shantytownParcelOwner.create(user, shantytown.id, ownersToCreate, transaction);
            } catch (error) {
                throw new ServiceError('parcel_owner_creation_failed', new Error(error?.message));
            }
        }

        if (argTransaction === undefined) {
            await transaction.commit();
        }
    } catch (error) {
        if (argTransaction === undefined) {
            await transaction.rollback();
        }
        throw new ServiceError('parcel_owner_update_failed', new Error(error?.message));
    }
};
