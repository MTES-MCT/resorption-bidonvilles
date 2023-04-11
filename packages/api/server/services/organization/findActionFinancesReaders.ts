
import organizationModel from '#server/models/organizationModel';
import ServiceError from '#server/errors/ServiceError';
import { SerializedOrganization } from '#server/models/userModel/getDirectory';

export default async (): Promise<SerializedOrganization[]> => {
    try {
        return await organizationModel.findActionFinancesReaders();
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }
};