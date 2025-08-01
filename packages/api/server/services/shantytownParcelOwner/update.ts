import permissionUtils from '#server/utils/permission';
import { Transaction } from 'sequelize';
import shantytownParcelOwner from '#server/models/shantytownParcelOwnerModel';
import ServiceError from '#server/errors/ServiceError';
import { sequelize } from '#db/sequelize';
import { AuthUser } from '#server/middlewares/authMiddleware';
import { Location } from '#server/models/geoModel/Location.d';
// import serializeOwners from './serializeOwners';
import { Shantytown } from '#root/types/resources/Shantytown.d';
import { ParcelOwnerInsert, RawParcelOwner } from '#root/types/resources/ParcelOwner.d';

// export default async (user: AuthUser, shantytown: Shantytown, owners: ParcelOwnerInsert[], argTransaction: Transaction | undefined = undefined): Promise<ParcelOwners> => {
export default async (user: AuthUser, shantytown: Shantytown, owners: ParcelOwnerInsert[], argTransaction: Transaction | undefined = undefined): Promise<void> => {
    let transaction: Transaction = argTransaction;
    transaction ??= await sequelize.transaction();

    // let updatedParcelOwner: RawParcelOwner[];

    const location: Location = {
        type: 'departement',
        region: shantytown.region,
        departement: shantytown.departement,
        epci: null,
        city: null,
    };

    if (!permissionUtils.can(user).do('access', 'shantytown_owner').on(location)) {
        throw new ServiceError('permission_denied', new Error('Vous n\'avez pas la permission de modifier un propriétaire de parcelle'));
    }

    // On récupère les propriétaires existants pour le site
    let actualOwners: RawParcelOwner[] = [];
    try {
        actualOwners = await shantytownParcelOwner.findAll(user, shantytown.id, transaction);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Erreur lors de la récupération des propriétaires existants :', error);
        throw new ServiceError('parcel_owner_fetch_failed', new Error('Erreur lors de la récupération des propriétaires existants'));
    }

    const oldOwnerIds = actualOwners.map(o => o.shantytown_parcel_owner_id);

    // Propriétaires à CRÉER
    const ownersToCreate: ParcelOwnerInsert[] = owners.filter(o => o.ownerId === null || o.ownerId === undefined);

    // Propriétaires à METTRE À JOUR
    const ownersToUpdate: ParcelOwnerInsert[] = owners.filter(o => o.ownerId !== null
        && o.ownerId !== undefined
        && oldOwnerIds.includes(o.ownerId));

    // Propriétaires à DÉSACTIVER
    const newOwnerIds = owners.map(o => o.ownerId);
    const ownersToSoftDelete = actualOwners
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
                await shantytownParcelOwner.update(user, shantytown.id, allOwnersForUpdate, transaction);
            } catch (error) {
                // await transaction.rollback();
                throw new ServiceError('parcel_owner_creation_failed', new Error(error?.message));
            }
        }

        // On ajoute les nouveaux propriétaires
        if (ownersToCreate.length > 0) {
            try {
                const newOwners: ParcelOwnerInsert[] = owners.filter(o => o.ownerId === null || o.ownerId === undefined);
                await shantytownParcelOwner.create(user, shantytown.id, newOwners, transaction);
            } catch (error) {
                // await transaction.rollback();
                throw new ServiceError('parcel_owner_creation_failed', new Error(error?.message));
            }
        }

        if (argTransaction === undefined) {
            console.log('Commiting transaction (argTransaction):', transaction);

            await transaction.commit();
        }
    } catch (error) {
        if (argTransaction === undefined) {
            await transaction.rollback();
        }
        console.log('Erreur, on rollback');

        throw new ServiceError('parcel_owner_update_failed', new Error(error?.message));
    }
    console.log('On a fini la mise à jour');

    // return serializeOwners(user as AuthUser, updatedParcelOwner);
};
