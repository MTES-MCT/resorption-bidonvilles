
import actionModel from '#server/models/actionModel';
import ServiceError from '#server/errors/ServiceError';
import { SerializedOrganization } from '#server/models/userModel/getDirectory';

export default async (managers: number[]): Promise<SerializedOrganization[]> => {
    try {
        return await actionModel.findActionFinancesReadersByManagers(managers);
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }
};
