import organizationModel from '#server/models/organizationModel';
import ServiceError from '#server/errors/ServiceError';
import { SerializedOrganization } from '#server/models/userModel/getDirectory';

export default async (shantytownId: number): Promise<SerializedOrganization[]> => {
    try {
        return await organizationModel.findJusticeReadersByShantytown(shantytownId);
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }
};
