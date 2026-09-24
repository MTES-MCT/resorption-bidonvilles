import shantytownModel from '#server/models/shantytownModel';
import ServiceError from '#server/errors/ServiceError';
import { AuthUser } from '#server/middlewares/authMiddleware';
import { Shantytown } from '#root/types/resources/Shantytown.d';

export default async function findNearby(user: AuthUser, latitude: number, longitude: number, distance: number): Promise<Shantytown[]> {
    try {
        return await shantytownModel.findNearby(user, latitude, longitude, distance);
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }
}
