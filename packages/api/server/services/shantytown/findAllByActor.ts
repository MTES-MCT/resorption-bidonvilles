import shantytownModel from '#server/models/shantytownModel';
import ServiceError from '#server/errors/ServiceError';

export default async (user) => {
    let towns;
    try {
        towns = await shantytownModel.findAllByActor(user);
    } catch (error) {
        throw new ServiceError('fetch_failed', new Error('Impossible de trouver les site en base de données'));
    }

    return towns;
};
