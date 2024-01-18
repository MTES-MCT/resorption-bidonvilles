import ServiceError from '#server/errors/ServiceError';
import { Location } from '#server/models/geoModel/Location.d';
import organizationModel from '#server/models/organizationModel';
import { Organization } from '#root/types/resources/Organization.d';

export default async (location: Location): Promise<Organization[]> => {
    try {
        return await organizationModel.findJusticeReadersByLocation(location);
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }
};
