import actionModel from '#server/models/actionModel/index';
import { ActionActivity } from '#server/models/actionModel/getHistory/getHistory';
import ServiceError from '#server/errors/ServiceError';
import { User } from '#root/types/resources/User.d';

export default async (user: User, actionId: number): Promise<ActionActivity[]> => {
    try {
        const history = await actionModel.getHistory(user, actionId);
        return history;
    } catch (error) {
        throw new ServiceError('fetch_failed', error);
    }
};
