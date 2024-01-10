import { sequelize } from '#db/sequelize';
import ServiceError from '#server/errors/ServiceError';
import Action from '#server/models/actionModel/fetch/Action.d';
import create from '#server/models/actionModel/create/create';
import { User } from '#root/types/resources/User.d';

import { ActionInput } from './ActionInput.d';
import fetchAction from './write.fetchAction';

export default async (user: User, data: ActionInput): Promise<Action> => {
    const transaction = await sequelize.transaction();
    let actionId;
    try {
        actionId = await create({
            ...data,
            address: data.location_eti,
            created_by: user.id,
        }, transaction);
    } catch (error) {
        await transaction.rollback();
        throw new ServiceError('action_insert_error', error);
    }

    try {
        const action = await fetchAction(actionId, true, transaction);
        await transaction.commit();

        return action;
    } catch (error) {
        await transaction.rollback();

        if (error instanceof ServiceError) {
            throw error;
        }

        throw new ServiceError('action_fetch_error', error);
    }
};
