import shantytownModel from '#server/models/shantytownModel';
import shantytownDecreeModel from '#server/models/shantytownDecreeModel';
import ServiceError from '#server/errors/ServiceError';
import { User } from '#root/types/resources/User.d';

export default async (user: User, townId: number) => {
    const town = await shantytownModel.findOne(user, townId);

    if (town === null) {
        throw new ServiceError('fetch_failed', new Error('Impossible de retrouver le site en base de données'));
    }

    const shantytownDecrees = await shantytownDecreeModel.findAll(townId);

    return shantytownDecrees;
};
