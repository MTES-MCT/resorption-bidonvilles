import ServiceError from '#server/errors/ServiceError';
import accessRequestService from '#server/services/accessRequest/accessRequestService';
import { User } from '#root/types/resources/User.d';
import { ContactBody } from '#root/types/inputs/ContactBody.d';
import create from './create';

export default async (data: ContactBody): Promise<User> => {
    let user;
    try {
        user = await create({
            last_name: data.last_name,
            first_name: data.first_name,
            email: data.email,
            phone: data.phone,
            organization: data.organization_full?.id || null,
            position: data.position,
            access_request_message: data.access_request_message,
        });
    } catch (error) {
        throw new ServiceError('insert_failed', error);
    }

    try {
        await accessRequestService.handleNewAccessRequest(user);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        // @todo register this error to Sentry
        // @todo: générer une transaction et conditionner le commit de la transaction à la réussite de handleNewAccessRequest
    }

    return user;
};
