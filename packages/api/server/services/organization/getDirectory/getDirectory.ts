import ServiceError from '#server/errors/ServiceError';
import getDirectoryModel from '#server/models/organizationModel/getDirectory';
import { Organization } from '#root/types/resources/Organization.d';
import { User } from '#root/types/resources/User.d';

const getDirectory = async (requestingUser: User): Promise<Organization[]> => {
    try {
        return await getDirectoryModel(requestingUser);
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }
};

export default getDirectory;
