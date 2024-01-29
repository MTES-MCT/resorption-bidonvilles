import shantytownModel from '#server/models/shantytownModel';
import ServiceError from '#server/errors/ServiceError';
import can from '#server/utils/permission/can';

export default async (user, shantytown_id) => {
    // check if the town exists
    let town;
    try {
        town = await shantytownModel.findOne(
            user,
            shantytown_id,
        );
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }

    if (town === null) {
        throw new ServiceError('shantytown_unfound', new Error(`le site #${shantytown_id} n'existe pas en base de données`));
    }

    if (!can(user).do('delete', 'shantytown').on(town)) {
        throw new ServiceError(
            'delete_denied',
            new Error(`Vous n'avez pas les droits suffisants pour supprimer le site #${shantytown_id}`),
        );
    }

    // delete the town
    try {
        await shantytownModel.deleteShantytown(shantytown_id);
    } catch (error) {
        throw new ServiceError('delete_failed', error);
    }
};
