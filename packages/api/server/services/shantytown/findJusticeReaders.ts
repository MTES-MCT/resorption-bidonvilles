import organizationModel from '#server/models/organizationModel';
import ServiceError from '#server/errors/ServiceError';
import { Organization } from '#root/types/resources/Organization.d';

export default async (shantytownId: number): Promise<Organization[]> => {
    try {
        return await organizationModel.findJusticeReadersByShantytown(shantytownId, null);
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }
};
