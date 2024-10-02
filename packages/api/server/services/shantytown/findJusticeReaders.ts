import organizationModel from '#server/models/organizationModel';
import ServiceError from '#server/errors/ServiceError';
import { Organization } from '#root/types/resources/Organization.d';

export default async (shantytownId: number, userId: number = null): Promise<Organization[]> => {
    console.log('User ID: ', userId, 'Shantytown ID: ', shantytownId);

    try {
        return await organizationModel.findJusticeReadersByShantytown(shantytownId, userId);
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }
};
