import ServiceError from '#server/errors/ServiceError';
import organizationModel from '#server/models/organizationModel/index';
import statsDirectoryViewsModel from '#server/models/statsDirectoryViewsModel';
import { User } from '#root/types/resources/User.d';

const create = async (organizationId: number, requestingUser: User): Promise<void> => {
    let organization;
    try {
        organization = await organizationModel.findOneById(organizationId, false, requestingUser);
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }

    if (organization === null) {
        throw new ServiceError('organization_not_found', new Error(`L'organisation ${organizationId} n'existe pas`));
    }

    try {
        await statsDirectoryViewsModel.create(organizationId, requestingUser.id);
    } catch (error) {
        throw new ServiceError('write_failed', error);
    }
};

export default create;
