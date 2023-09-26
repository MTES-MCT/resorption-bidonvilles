import { SerializedUser } from '#server/models/userModel/_common/types/SerializedUser.d';
import ServiceError from '#server/errors/ServiceError';
import accessRequestService from '#server/services/accessRequest/accessRequestService';
import { ContactBody } from '#root/types/inputs/ContactBody.d';
import create from './create';

export default async (data: ContactBody): Promise<SerializedUser> => {
    let user;
    try {
        user = await create({
            last_name: data.last_name,
            first_name: data.first_name,
            email: data.email,
            phone: data.phone,
            organization: data.organization_full?.id || null,
            new_association: data.new_association,
            new_association_name: data.new_association_name || null,
            new_association_abbreviation: data.new_association_abbreviation || null,
            departement: data.departement || null,
            position: data.position,
            access_request_message: data.access_request_message,
        });
    } catch (error) {
        throw new ServiceError('insert_failed', error);
    }

    try {
        await accessRequestService.handleNewAccessRequest(user);
    } catch (error) {
        // @todo register this error to Sentry
    }

    return user;
};
