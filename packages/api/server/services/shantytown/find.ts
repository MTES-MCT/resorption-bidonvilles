import shantytownModel from '#server/models/shantytownModel';
import ServiceError from '#server/errors/ServiceError';

export default async (user, townId) => {
    const town = await shantytownModel.findOne(user, townId);
    if (town === null) {
        throw new ServiceError('fetch_failed', new Error('Impossible de retrouver le site en base de données'));
    }
    return town;
};
