
import actionModel from '#server/models/actionModel';
import ServiceError from '#server/errors/ServiceError';
import { Organization } from '#root/types/resources/Organization.d';

export default async (actionId: number): Promise<Organization[]> => {
    try {
        return await actionModel.findActionFinancesReadersByAction(actionId);
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }
};
