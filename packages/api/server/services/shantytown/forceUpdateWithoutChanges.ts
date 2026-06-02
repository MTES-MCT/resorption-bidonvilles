import { sequelize } from '#db/sequelize';
import shantytownModel from '#server/models/shantytownModel';
import ServiceError from '#server/errors/ServiceError';
import permissionUtils from '#server/utils/permission';

import { AuthUser } from '#server/middlewares/authMiddleware';
import { Location } from '#server/models/geoModel/Location.d';


export default async function forceUpdateWithoutChanges(townId: number, user: AuthUser): Promise<boolean> {
    const transaction = await sequelize.transaction();

    try {
        // On récupère le site tel qu'il est actuellement en DB pour historiser la demande de MAJ sans modif
        const town = await shantytownModel.findRaw(townId, transaction);
        if (!town) {
            throw new ServiceError('not_found', new Error('Le site n\'existe pas'));
        }

        const { location: rawLocation, ...townData } = town;

        const location: Location = {
            type: 'city',
            region: rawLocation?.region,
            departement: rawLocation?.departement,
            epci: rawLocation?.epci,
            city: rawLocation?.city,
        };

        // On vérifie que l'utilisateur a les droits de modification sur le site
        if (!user || !permissionUtils.can(user).do('update', 'shantytown').on(location)) {
            throw new ServiceError('permission_denied', new Error('Vous n\'avez pas accès à ces données'));
        }

        // On modifie la date de MAJ et le champ updated_without_any_change
        townData.updated_at = new Date(Date.now());
        townData.updated_without_any_change = true;

        await shantytownModel.update(user, townId, townData, transaction);
        await transaction.commit();

        return true;
    } catch (error) {
        await transaction.rollback();

        if (error instanceof ServiceError) {
            throw error;
        }

        throw new ServiceError('update_failed', error);
    }
}
