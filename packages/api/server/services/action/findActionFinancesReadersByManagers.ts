
import actionModel from '#server/models/actionModel';
import ServiceError from '#server/errors/ServiceError';
import { Departement } from '#server/models/geoModel/Location.d';
import { Organization } from '#root/types/resources/Organization.d';

export default async (departement: Departement, managers: number[]): Promise<Organization[]> => {
    try {
        return await actionModel.findActionFinancesReadersByManagers(departement, managers);
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }
};
