
import actionModel from '#server/models/actionModel';
import ServiceError from '#server/errors/ServiceError';
import { SerializedOrganization } from '#server/models/userModel/getDirectory';

export default async (actionId: number): Promise<SerializedOrganization[]> => {
    try {
        return await actionModel.findActionFinancesReadersByAction(actionId);
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }
};
