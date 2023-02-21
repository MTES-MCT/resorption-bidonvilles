import userModel from '#server/models/userModel';
import ServiceError from '#server/errors/ServiceError';

export default async (shantytownId: number) => {
    try {
        return await userModel.findJusticeReaders(shantytownId);
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }
};
