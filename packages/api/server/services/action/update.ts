import ServiceError from '#server/errors/ServiceError';
import actionModel from '#server/models/actionModel';
import Action from '#server/models/actionModel/fetch/Action.d';
import { ActionInput } from './ActionInput.d';

export default async (actionId: number, authorId: number, data: ActionInput): Promise<Action> => {
    try {
        await actionModel.update(actionId, {
            ...data,
            address: data.location_eti,
            updated_by: authorId,
        });
        const actions = await actionModel.fetch([actionId]);

        return actions[0];
    } catch (error) {
        throw new ServiceError('db_write_error', error);
    }
};
