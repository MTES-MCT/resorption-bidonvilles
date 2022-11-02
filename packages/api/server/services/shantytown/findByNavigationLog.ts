import shantytownModel from '#server/models/shantytownModel';
import ServiceError from '#server/errors/ServiceError';

export default async (user) => {
    let towns;
    try {
        towns = await shantytownModel.findByNavigationLog(user);
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }

    return towns;
};
