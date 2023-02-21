import userModel from '#server/models/userModel';
import ServiceError from '#server/errors/ServiceError';
import { JusticeReaderRow } from '#server/models/userModel/findJusticeReaders';

export default async (shantytownId: number): Promise<JusticeReaderRow[]> => {
    try {
        return await userModel.findJusticeReaders(shantytownId);
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }
};
