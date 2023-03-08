import { Transaction } from 'sequelize';
import ServiceError from '#server/errors/ServiceError';
import Action from '#server/models/actionModel/fetch/Action.d';

import actionModel from '#server/models/actionModel';

const { fetch } = actionModel;

async function fetchActions(actionId: number, transaction: Transaction) {
    try {
        return await fetch([actionId], null, transaction);
    } catch (error) {
        await transaction.rollback();
        throw new ServiceError('action_fetch_error', error);
    }
}

export default async (actionId: number, transaction: Transaction): Promise<Action> => {
    const actions = await fetchActions(actionId, transaction);

    if (actions.length !== 1) {
        await transaction.rollback();
        throw new ServiceError('action_not_found', new Error('Action could not be found in database'));
    }

    return actions[0];
};
