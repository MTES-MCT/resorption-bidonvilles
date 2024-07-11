import { sequelize } from '#db/sequelize';
import ServiceError from '#server/errors/ServiceError';
import create from '#server/models/actionModel/create/create';
import { EnrichedAction } from '#root/types/resources/ActionEnriched.d';
import { User } from '#root/types/resources/User.d';
import { ActionInput } from './ActionInput.d';

import fetchAction from './write.fetchAction';

export default async (user: User, data: ActionInput): Promise<EnrichedAction> => {
    const transaction = await sequelize.transaction();

    let actionId: number;
    try {
        actionId = await create({
            ...data,
            address: data.location_eti,
            created_by: user.id,
        }, transaction);
    } catch (error) {
        await transaction.rollback();
        throw new ServiceError('insert_action_error', error);
    }

    let action: EnrichedAction;
    try {
        action = await fetchAction(user, actionId, true, transaction);
    } catch (error) {
        await transaction.rollback();
        throw new ServiceError('action_fetch_error', error);
    }

    try {
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw new ServiceError('commit_failed', error);
    }

    return action;
};
