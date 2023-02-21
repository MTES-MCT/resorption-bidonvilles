import userModel from '#server/models/userModel';
import ServiceError from '#server/errors/ServiceError';

export default async (shantytownId: number) => {
    let usersWhoCanAccessJustice = [];
    try {
        usersWhoCanAccessJustice = await userModel.findJusticeReaders(shantytownId);
        if (usersWhoCanAccessJustice.length > 0) {
            return usersWhoCanAccessJustice;
        }
        return [];
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }
};
