import ServiceError from '#server/errors/ServiceError';
import { Location } from '#server/models/geoModel/Location.d';
import organizationModel from '#server/models/organizationModel';
import { SerializedOrganization } from '#server/models/userModel/getDirectory';

export default async (location: Location): Promise<SerializedOrganization[]> => {
    try {
        return await organizationModel.findJusticeReadersByLocation(location);
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }
};
